export const getCdrColumnName = (data) => {
  switch (data) {
    case "id":
      return "Record Id";
    case "lga":
      return "LGA";
    case "yyyymm":
      return "Date";
    case "timestampdate":
      return "Timestamp (Date)";
    case "timestamptime":
      return "Timestamp (Time)";
    case "answerdate":
      return "Answer (Date)";
    case "answertime":
      return "Call start";
    case "callduration":
      return "Call Duration";
    case "calledimei":
      return "Called IMEI";
    case "calledimsi":
      return "Called IMSI";
    case "callednumber":
      return "Called MSISDN";
    case "callingnumber":
      return "Calling MSISDN";
    case "servedimei":
      return "Served IMEI";
    case "servedimeifull":
      return "Served IMEI Full";
    case "servedimsi":
      return "Served IMSI";
    case "servedmsisdn":
      return "Served MSISDN";
    case "locationestimate":
      return "Location Estimate";
    case "locationlat":
      return "Cell Lat";
    case "locationlon":
      return "Cell Lon";
    case "callredirectionflag":
      return "Call Direction";
    case "cgi":
      return "CGI";
    case "city":
      return "City";
    case "connectednumber":
      return "Connected Number";
    case "eventtype":
      return "Record/ Event Type";
    case "geohash":
      return "GEOHASH";
    case "releasedate":
      return "Release (Date)";
    case "releasetime":
      return "Release (Time)";
    case "rat":
      return "RAT";
    case "operator":
      return "Operator";
    case "locationupdatetype":
      return "LU Type";
    case "address":
      return "Address";
    case "callingimei":
      return "Calling IMEI";
    case "callingimsi":
      return "Calling IMSI";
    case "callingfirstcgi":
      return "Calling First CGI";
    case "callinglastcgi":
      return "Calling Last CGI";
    case "calledfirstcgi":
      return "Called First CGI";
    case "calledlastcgi":
      return "Called Last CGI";
    case "callingfirstlocationlat":
      return "Calling First Location Lat";
    case "callinglastlocationlon":
      return "Calling Last Location Lon";
    case "callingfirstlocationlon":
      return "Calling First Location Lon";
    case "callinglastlocationlat":
      return "Calling Last Location Lat";
    case "calledfirstlocationlat":
      return "Called First Location Lat";
    case "calledfirstlocationlon":
      return "Called First Location Lon";
    case "calledlastlocationlat":
      return "Called Last Location Lat";
    case "calledlastlocationlon":
      return "Called Last Location Lon";
    case "callingfirstlocationaddress":
      return "Calling First Site";
    case "callinglastlocationaddress":
      return "Calling Last Site";
    case "calledfirstlocationaddress":
      return "Called First Site";
    case "calledlastlocationaddress":
      return "Called Last Site";
    case "sscode":
      return "SS Code";
    case "presentationandscreeningindicator":
      return "Presentation & Screen Indicator";
    case "cliindicator":
      return "CLI Indicator";
    case "callingnumberasname":
      return "Calling Number (as name)";
    default:
      return data;
  }
};

export const hiddenFields = [
  "sscode",
  "presentationandscreeningindicator",
  "id",
  "yyyymm",
  "timestampdate",
  "timestamptime",
  "answerdate",
  "servedimei",
  "servedimsi",
  "callingnumberactual",
  "locationestimate",
  // "locationlat",
  // "locationlon",
  "callredirectionflag",
  "city",
  "connectednumber",
  "geohash",
  "releasedate",
  "releasetime",
  "rat",
  "operator",
  "locationupdatetype",
  "address",
  "smstext",
  "maxsmsconcated",
  "concatsmsrefnumber",
  "seqnoofcurrentsms",
  "sgwipaddress",
  "servingnodeipaddress",
  "accesspointnameni",
  "servedpdppdnaddress",
  "accountcode",
  "drccallid",
  "smsuserdatatype",
  "systemtype",
  "chargedparty",
  // "subscribercategory",
  "usertype",
  "recordnumber",
  "partyrelcause",
  "chargelevel",
  "zonecode",
  "recordingentity",
  "seizureordeliverytime",
  "causeforterm",
  "diagnostics",
  "sequencenumber",
  "networkcallreference",
  "mscaddress",
  "timebucket",
  "calledportedflag",
  "callerportedflag",
  "callreference",
  "cellid",
  "firstmccmnc",
  "globalcallreference",
  "locationnum",
  "lastmccmnc",
  "lac",
  "intermediatemccmnc",
  "imeistatus",
  "timestamp",
  "timestampdate",
  "timestamptime",
  // "locationlat",
  // "locationlon",
  "locationnum",
];
