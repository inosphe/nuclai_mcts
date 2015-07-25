#-------------------------------------------------------------------------------

$cfg =
{
    id:         "legends",
    title:      "Legends",
    dir_root:   File.expand_path( File.dirname( __FILE__ ) )
}

# key diretories

$cfg[ :dir_root ]   = File.expand_path File.dirname __FILE__
$cfg[ :dir_out ]    = File.expand_path "#{ $cfg[ :dir_root ] }/../root/"
$cfg[ :dir_3p ]     = File.expand_path "#{ $cfg[ :dir_root ] }/../third_party/"
$cfg[ :dir_build ]  = File.expand_path "#{ $cfg[ :dir_root ] }/../build/"


$subdir =
{
    ".js"   => "js/",
    ".css"  => "css/",
    ".json" => "data/",
    ".woff" => "fonts/",
    ".eot"  => "fonts/",
    ".png"  => "img/",
    ".jpg"  => "img/",
    ".ico"  => "img/",
    ".gif"  => "img/"
}

$subdir.default = ""


#-------------------------------------------------------------------------------

def init path

    $cfg[:dir_local] = File.expand_path( File.dirname( path ) )

    if $cfg[:dir_local] == $cfg[:dir_root]
        $cfg[:url_local] = ""
        $cfg[:url_root]  = ""
    else
        $cfg[:url_local] = $cfg[:dir_local][ $cfg[:dir_root].length + 1 .. -1 ]
        $cfg[:url_root]  = $cfg[:url_local].gsub( /\w+/, '..' ) + "/"
    end

end


#-------------------------------------------------------------------------------
# convert the given url to a 'project relative' path
#
# //  library path
# /   path from root
#     relative path
#

def path url

    dir = ""

    if url[0..1] == "//"

        ext = File.extname url
        dir = "#{ $cfg[:url_root] }#{ $subdir[ ext ] }"
        url = url[2..-1]

    elsif url[0] == "/"

        dir = "#{ $cfg[:url_root] }/"
        url = url[1..-1]

    end

    return "#{dir}#{url}"

end



#-------------------------------------------------------------------------------
# all purpose 'include' function - do the right thing based on file extension

def inc url

    case File.extname url

    when ".js"
        return "<script src='#{ path url }' type='text/javascript'></script>"

    when ".css"
        return "<link href='#{ path url }' rel='stylesheet'>"

    when ".ico"
        return "<link href='#{ path url }' rel='bookmark'>"

    else

        # embed haml file
        return Haml::Engine.new( File.read "#{ $cfg[:dir_local] }/#{ path url }" ).render

    end

end


#-------------------------------------------------------------------------------
# render a haml file

def haml partial
    return Haml::Engine.new( File.read( "#{ $cfg[:dir_root] }/#{ partial }.haml" ) ).render
end



#-------------------------------------------------------------------------------
# embed slides

def slides

    out = ""

    Dir.glob( "#{ $cfg[:dir_root] }/slides/*.haml" ) do |file|
        out +=  Haml::Engine.new( File.read( file ) ).render
    end

    return out

end

def slidesjs

    out = ""

    Dir.glob( "#{ $cfg[:dir_root] }/slides/*.coffee" ) do |file|
        file = File.basename file, '.coffee'
        out += "<script src='slides/#{file}.js' type='text/javascript'></script>"
    end

    return out

end
