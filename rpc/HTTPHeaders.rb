# Ruby HTTP parser/generator

class HTTPHeaders
	attr_reader :request, :headers, :body, :url

	def initialize(text)
		lines = text.split("\n")
		@request = lines.shift
		@request =~ /^\S+\s\/(\S+)\s/
		@url = $1
		@headers = {}
		last_index = 0
		lines.each_with_index do |line, index|
			if line.size <= 1
				last_index = index
				break
			end

			if line =~ /^(\S+)\: (.+)$/
				@headers[$1] = $2
			end
		end

		@body = lines[last_index+1..lines.size].join("\n")
	end

	def to_s
		return [@request,@url,@headers.map { |k,v| "#{k}: #{v}"},"",@body].join("\n")
	end
end

class HTTPResponse
	attr_accessor :protocol, :code, :message

	def initialize(code, message)
		@code = code
		@message = message

		# Defaults
		@protocol = "HTTP/1.1"
		@headers = {}
		set("Content-Type","text/plain")
		set("Server","Ruby")
		set("Connection","close")
		set("Access-Control-Allow-Origin","http://localhost")

		@content = ""
	end

	def content=(str)
		@content = str
		set("Content-length",str.bytesize)
	end

	def []=(k,v)
		@headers[k] = v
	end
	alias set []=

	def to_s
		["#{protocol} #{code} #{message}",@headers.map { |k,v| "#{k}: #{v}"},"",@content].flatten.join("\r\n")
	end
end

class HTTPOK < HTTPResponse
	def initialize()
		super("200","OK")
	end
end

class HTTPMethodNotAllowed < HTTPResponse
	def initialize()
		super("405","Method Not Allowed")
	end
end