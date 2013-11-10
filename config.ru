require 'cadenza'
require 'sass'

renderer = ->(env) {

  headers = {}

  file_name = env['PATH_INFO'].sub(/^\//, '')

  if env['PATH_INFO'] == '/index.html' || file_name == ''
    Cadenza::BaseContext.add_load_path "#{Dir.pwd}/_layouts"
    template = File.read("index.html")
    content = Cadenza.render template, {}
    headers["Content-Type"] = "text/html"
  elsif env['PATH_INFO'] =~ /\.css$/
    sass_template = env['PATH_INFO'].sub(/^\//, '') + '.scss'
    sass_engine = Sass::Engine.for_file(sass_template, cache: false, trace: true, syntax: :scss, load_paths: ["#{Dir.pwd}/styles"])
    content = sass_engine.render
  else
    content = File.read(file_name)
  end


    [200, headers, [content]]
}

run renderer
