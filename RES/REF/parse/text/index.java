

fs.readFile(filename,'utf-8',function(err,data)){}


// 分析文件内容

var is = data.indexOf('VmRss')

var ie = data.indexOf('KB',is+1)
if( is< 0 || ie <0 )
	error()

var mem = data.substr(is+7,ie-is)
// 单位 kb
mem = parseInt(mem)

......

}