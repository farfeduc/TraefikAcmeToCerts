var fs = require("fs");
var path = require("path");
var acme = require(__dirname + "/acme/acme.json");

function removeWildcard(domain){
  if(domain.indexOf("*") > -1) {
    return domain.replace('*', 'wildcard');
  }
  else {
    return domain
  }
}

function writeCertsFiles(domain, cert, key){
  var certDump = new Buffer(cert, 'base64');
  var keyDump = new Buffer(key, 'base64');

  fs.writeFileSync(path.join(__dirname, "certs/" + domain + ".crt"), certDump);
  fs.writeFileSync(path.join(__dirname, "certs/" + domain + ".key"), keyDump);
}

if (typeof(acme) === 'undefined' || (!acme.hasOwnProperty("Certificates") && !acme.hasOwnProperty("DomainsCertificate")) ) {
    console.log("Nothing to do");
}
else {
  if(typeof(acme) !== 'undefined' && acme.hasOwnProperty("DomainsCertificate")){
    for (var cert of acme.DomainsCertificate.Certs) {
      let domain = removeWildcard(cert.Certificate.Domain);
      writeCertsFiles(domain, cert.Certificate.Certificate, cert.Certificate.PrivateKey);
    }
  }
  if (typeof(acme) !== 'undefined' && acme.hasOwnProperty("Certificates")){
    for (var cert of acme.Certificates) {
      let domain = removeWildcard(cert.Domain.Main);
      writeCertsFiles(domain, cert.Certificate, cert.Key);
    }
  }
  console.log("Successfully write all your acme certs & keys");
}
