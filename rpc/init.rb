# Ruby backend for Card Editor
#
# Usage: ruby #{$0}

require 'eventmachine'
require 'optparse'
require 'EditorServer.rb'

# Process command line options
options = {
	:ip => "127.0.0.1",
	:port => 8088,
}
OptionParser.new do |opts|
	opts.banner = "Handles filesystem events for Card Editor\n\nUsage: #{$0} [options]"

	opts.on("-i","--ip ADDRESS", "Bind to IP address. Defaults to '#{options[:ip]}'.") do |h|
		options[:ip] = h
	end

	opts.on("-p","--port PORT", "Bind to the specified local port. Defaults to #{options[:port]}") do |v|
		options[:port] = v.to_i
	end

	opts.on_tail("-h","--help","Show this usage information.") do
		puts opts
		exit
	end
end.parse!

# Start the EventMachine server
EventMachine::run do
	host = options[:ip]
	port = options[:port]

	EventMachine::start_server(host, port, EditorServer)

	STDERR.puts "Started EditorServer on #{host}:#{port}"
end