

String extractResult = Html.create(html).$("div.body").xpath("//a/@href")
.regex(".*blog.*").toString(); 