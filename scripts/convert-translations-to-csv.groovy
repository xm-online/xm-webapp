@Grab(group = 'net.sf.opencsv', module = 'opencsv', version = '2.3')
import au.com.bytecode.opencsv.CSVWriter
import groovy.io.FileType
import groovy.json.JsonSlurper

String inDir = this.args[0]
String outDir = this.args[1]

File dir = new File(inDir)

List list = new LinkedList();
println("Processing folder ${inDir}")
dir.eachFileRecurse(FileType.FILES) { it ->
  if (it.name.endsWith('.json')) {
    println("Started converting file ${it.name}")
    Map data = new JsonSlurper().parse(it)
    list.addAll(convert(data, "", it.name))
    println("Finished converting file ${it.name}")
  }
}

File csvFile = new File(outDir.concat("/translations-${System.currentTimeMillis()}.csv"))
csvFile.createNewFile()

csvFile.withWriter { writer ->
  CSVWriter csvWriter = new CSVWriter(writer)
  list.each { v ->
    csvWriter.writeNext(v as String[])
  }
}

println("Output file created ${csvFile.path}")

System.exit(0);

List convert(Object value, String key, String fileName) {
  List retval = new LinkedList<>()
  if (value instanceof Map) {
    value.each { k, v ->
      String nextKey = key.concat(key == "" ? "" : ".").concat(k.replace(".", "\$dot\$"))
      retval.addAll(convert(v, nextKey, fileName))
    }
  }
  if (value instanceof List) {
    value.each { v ->
      retval.addAll(convert(v, key, fileName))
    }
  }
  if (value instanceof String) {
    retval.add([fileName, key, value])
  }
  return retval;
}


