@Grab(group = 'net.sf.opencsv', module = 'opencsv', version = '2.3')
import au.com.bytecode.opencsv.CSVReader
import groovy.io.FileType

import java.util.stream.Collectors

String inDir = this.args[0]
String outDir = this.args[1]

File dir = new File(inDir)
Map<String, List<String[]>> data = new HashMap<>()

println("Processing folder ${inDir}")
dir.eachFileRecurse(FileType.FILES) { it ->
  if (it.name.endsWith('.csv')) {
    println("Started converting file ${it.name}")
    it.withReader { reader ->
      CSVReader csvReader = new CSVReader(reader)
      List<String[]> rows = csvReader.readAll()
      Map<String, List<String[]>> groupedRows =
        rows.stream().collect(Collectors.groupingBy({ c -> c[0] }))
      groupedRows.each { k, v ->
        if (data.containsKey(k)) {
          if (data.get(k)) {
            data.get(k).addAll(v)
          }
        } else {
          data.put(k, v)
        }
      }
    }
    println("Finished converting file ${it.name}")
  }
}

data.each { k, v ->
  Map jsonData = new HashMap();
  v.each { val ->
    String path = val[1]
    String value = val[2]
    convert(jsonData, path, value)
  }
  File jsonFile = new File(outDir.concat("/${k}"))
  jsonFile.createNewFile()
  jsonFile.write(groovy.json.JsonOutput.prettyPrint(groovy.json.JsonOutput.toJson(jsonData)))
}
System.exit(0)

void convert(Map ret, String currentJsonPath, String val) {
  String nextJsonPath = currentJsonPath
  String currentJsonNode = currentJsonPath
  if (currentJsonPath.contains(".")) {
    currentJsonNode = currentJsonPath.substring(0, currentJsonPath.indexOf("."))
    if (currentJsonNode.contains("\$dot\$")) {
      currentJsonNode = currentJsonNode.replaceAll("\\\$dot\\\$", ".")
    }
    nextJsonPath = currentJsonPath.substring(currentJsonPath.indexOf("."), currentJsonPath.length())
    if (nextJsonPath.charAt(0) == '.') {
      nextJsonPath = nextJsonPath.replaceFirst(".", "")
    }
    ret.putIfAbsent(currentJsonNode, new LinkedHashMap())
    convert(ret.get(currentJsonNode), nextJsonPath, val)
  } else {
    ret.putIfAbsent(currentJsonNode, val);
  }
}


