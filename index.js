var args = require('minimist')(process.argv.slice(2)),
  fs = require('fs'),
  path = process.argv[1]


  if (!args._){
    console.error('Error: No input file specified')
    return
  } else if (args._.length > 1) {
    console.error('Error: Multiple file arguments found\n')
    console.error('Files: ' + args._)
    return
  } else if (!args['t']){
    console.error('Error: No threshold argument found')
    return
  }

  var pandaFile = args._[0]

  fs.existsSync(pandaFile, function(exists){
    if (!exists){
      console.error('Error: Could not find specified file.')
      console.error('Read path: ' + pandaFile)
      process.abort()
    }
  })

  if (!args['f']  && !args['o']){

    var stream = fs.createReadStream(pandaFile)

    var cache = '', threshold = args['t'];

    stream.on('data', function(buffer){
        cache = cache.concat(buffer.toString())
    })

    var significant = args['s'] ? true : false

    stream.on('end', function(){
        if (cache == ''){
          console.error('Error: File did not push buffer to cache')
        }
        console.log('Source\tTarget\tSignificance\tWeight\n')
        var lines = cache.split('\n')
        lines.map(function(line){
	  var elements = line.split('\t')
          var number = elements[3]
          var significance = elements[2]
          if ((number >= threshold) && (significance >= 1) && significant) {
            console.log(line)
          }
        })
    })
  }
