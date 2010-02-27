#!/usr/bin/env ruby

require 'rubygems'
require 'json'
require 'time'
require 'net/http'

USERNAME = "pooptag"
PASSWORD = ENV['PASSWORD']
TRENGINE = ENV['TRENGINE']

def direct_messages option="count=200"
  req = Net::HTTP::Get.new("/direct_messages.json?#{option}")
  JSON.parse(twitter(req))
end

def twitter req
  req.basic_auth USERNAME, PASSWORD
  http('twitter.com', req)
end

def trengine sender, time
  req = Net::HTTP::Post.new("/#{TRENGINE}")
  req["content-type"] = "application/json"
  req.body = {sender => 1, 'pooptag' => 1, 'time' => time}.to_json
  http('trengine.com', req)
end

def http host, req
  res = Net::HTTP.start(host) {|http| http.request(req) }
  unless Net::HTTPSuccess === res
    STDERR.puts res.body
    res.error!
  end
  res.body
end

loop do
  arg = @max_id ? "count=200&max_id=#{@max_id.to_i-1}" : "count=200"
  messages = direct_messages arg
  break if messages.empty?
  messages.each do |msg|
    t = msg['created_at']
    name = msg['sender_screen_name']
    trengine name, t
    puts "#{t}: [#{msg['sender_screen_name']}] #{msg['text']}"
  end
  @max_id = messages.last['id']
end
