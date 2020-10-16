import groovy.io.FileType
import groovy.json.*


String inDir = this.args[0]
String separator = this.args[2]
String outDir = this.args[1]

File dir  = new File(inDir)

List list = new LinkedList();
dir.eachFileRecurse(FileType.FILES) { it ->
  if(it.name.endsWith('.json')) {
    Map data = new JsonSlurper().parse(it)
    list.addAll(convert(data, "", it.name))
  }
}

PrintWriter writer = new PrintWriter(outDir.concat("/translations-${System.currentTimeMillis()}.csv"), "UTF-8")
writer.println("key".concat(separator).concat("value").concat(separator).concat("fileName"))
list.each{ it ->
  writer.println("".concat(it.key).concat(separator).concat(it.value).concat(separator).concat(it.file))
}
writer.close()
System.exit(0);

List convert(Object value, String key, String fileName){
  List retval = new LinkedList<>()
  if (value instanceof Map){
    value.each{ k, v ->
      key1 = key.concat(".").concat(k.replace(".", "\$dot\$"))
      retval.addAll(convert(v, key1, fileName))}
  }
  if (value instanceof List){
    value.each{  v ->
      retval.addAll(convert(v, key,fileName))}
  }
  if (value instanceof String){
    retval.add([key: key, value: value, file:fileName])
  }
  return  retval;
}


