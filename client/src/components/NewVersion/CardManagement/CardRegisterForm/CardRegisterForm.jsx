import { useHistory } from "react-router-dom/cjs/react-router-dom";
import "./CardRegisterForm.scss";
import { useEffect, useState } from "react";
import { Descriptions, message, Select, Spin } from "antd";
import { toast } from "react-toastify";
import { axiosService } from "src/util/service";
import { useDispatch, useSelector } from "react-redux";
import { CardItemVirtualFrontPreview } from "./CardItemVirtualFrontPreview";
import { CardItemVirtualBackPreview } from "./CardItemVirtualBackPreview";
import { roundDownDecimalValues } from "src/util/common";
import { coinUserWallet } from "src/redux/actions/coin.action";
import { useTranslation } from "react-i18next";
import { CardFeeScreen } from "./CardFeeScreen";
import { GLOBAL_TYPE } from "src/redux/reducers/globalReducer";

// export const codePhoneOptions = [
//   {
//     id: "1",
//     value: "86",
//     label: "+86 CN",
//   },
//   {
//     id: "2",
//     value: "61",
//     label: "+61 AU",
//   },
//   {
//     id: "3",
//     value: "93",
//     label: "+93 AF",
//   },
//   {
//     id: "4",
//     value: "355",
//     label: "+355 AL",
//   },
//   {
//     id: "5",
//     value: "213",
//     label: "+213 DZ",
//   },
//   {
//     id: "6",
//     value: "684",
//     label: "+684 WS",
//   },
//   {
//     id: "7",
//     value: "376",
//     label: "+376 AD",
//   },
//   {
//     id: "8",
//     value: "244",
//     label: "+244 AO",
//   },
//   {
//     id: "9",
//     value: "1264",
//     label: "+1264 AI",
//   },
//   {
//     id: "10",
//     value: "1268",
//     label: "+1268 AG",
//   },

//   {
//     id: "11",
//     value: "54",
//     label: "+54 AR",
//   },
//   {
//     id: "12",
//     value: "374",
//     label: "+374 AM",
//   },
//   {
//     id: "13",
//     value: "297",
//     label: "+297 AW",
//   },
//   {
//     id: "14",
//     value: "43",
//     label: "+43 AT",
//   },
//   {
//     id: "15",
//     value: "994",
//     label: "+994 AZ",
//   },
//   {
//     id: "16",
//     value: "1242",
//     label: "+1242 BS",
//   },
//   {
//     id: "17",
//     value: "973",
//     label: "+973 BH",
//   },
//   {
//     id: "18",
//     value: "880",
//     label: "+880 BD",
//   },
//   {
//     id: "19",
//     value: "1246",
//     label: "+1246 BB",
//   },
//   {
//     id: "20",
//     value: "375",
//     label: "+375 BY",
//   },

//   {
//     id: "21",
//     value: "32",
//     label: "+32 BE",
//   },
//   {
//     id: "22",
//     value: "501",
//     label: "+501 BZ",
//   },
//   {
//     id: "23",
//     value: "229",
//     label: "+229 BJ",
//   },
//   {
//     id: "24",
//     value: "1441",
//     label: "+1441 BM",
//   },
//   {
//     id: "25",
//     value: "975",
//     label: "+975 BT",
//   },

//   {
//     id: "26",
//     value: "591",
//     label: "+591 BO",
//   },
//   {
//     id: "27",
//     value: "387",
//     label: "+387 BA",
//   },
//   {
//     id: "28",
//     value: "267",
//     label: "+267 BW",
//   },
//   {
//     id: "29",
//     value: "55",
//     label: "+55 BR",
//   },
//   {
//     id: "30",
//     value: "673",
//     label: "+673 BN",
//   },

//   {
//     id: "31",
//     value: "359",
//     label: "+359 BG",
//   },
//   {
//     id: "32",
//     value: "226",
//     label: "+226 BF",
//   },
//   {
//     id: "33",
//     value: "257",
//     label: "+257 BI",
//   },
//   {
//     id: "34",
//     value: "855",
//     label: "+855 KH",
//   },
//   {
//     id: "35",
//     value: "237",
//     label: "+237 CM",
//   },

//   {
//     id: "36",
//     value: "1",
//     label: "+1 US",
//   },
//   {
//     id: "37",
//     value: "238",
//     label: "+238 CV",
//   },
//   {
//     id: "38",
//     value: "1345",
//     label: "+1345 KY",
//   },
//   {
//     id: "39",
//     value: "236",
//     label: "+236 CF",
//   },
//   {
//     id: "40",
//     value: "235",
//     label: "+235 TD",
//   },

//   {
//     id: "41",
//     value: "56",
//     label: "+56 CL",
//   },
//   {
//     id: "42",
//     value: "57",
//     label: "+57 CO",
//   },
//   {
//     id: "43",
//     value: "269",
//     label: "+269 KM",
//   },
//   {
//     id: "44",
//     value: "242",
//     label: "+242 CG",
//   },
//   {
//     id: "45",
//     value: "243",
//     label: "+243 CD",
//   },
//   {
//     id: "46",
//     value: "682",
//     label: "+682 CK",
//   },
//   {
//     id: "47",
//     value: "506",
//     label: "+506 CR",
//   },
//   {
//     id: "48",
//     value: "225",
//     label: "+225 CI",
//   },
//   {
//     id: "49",
//     value: "385",
//     label: "+385 HR",
//   },
//   {
//     id: "50",
//     value: "53",
//     label: "+53 CU",
//   },

//   {
//     id: "51",
//     value: "357",
//     label: "+357 CY",
//   },
//   {
//     id: "52",
//     value: "420",
//     label: "+420 CZ",
//   },
//   {
//     id: "53",
//     value: "45",
//     label: "+45 DK",
//   },
//   {
//     id: "54",
//     value: "253",
//     label: "+253 DJ",
//   },
//   {
//     id: "55",
//     value: "1767",
//     label: "+1767 DM",
//   },
//   {
//     id: "56",
//     value: "1890",
//     label: "+1890 DO",
//   },
//   {
//     id: "57",
//     value: "593",
//     label: "+593 EC",
//   },
//   {
//     id: "58",
//     value: "20",
//     label: "+20 EG",
//   },
//   {
//     id: "59",
//     value: "503",
//     label: "+503 SV",
//   },
//   {
//     id: "60",
//     value: "240",
//     label: "+240 GQ",
//   },

//   {
//     id: "61",
//     value: "291",
//     label: "+291 ER",
//   },
//   {
//     id: "62",
//     value: "372",
//     label: "+372 EE",
//   },
//   {
//     id: "63",
//     value: "251",
//     label: "+251 ET",
//   },
//   {
//     id: "64",
//     value: "500",
//     label: "+500 FK",
//   },
//   {
//     id: "65",
//     value: "298",
//     label: "+298 FO",
//   },
//   {
//     id: "66",
//     value: "679",
//     label: "+679 FJ",
//   },
//   {
//     id: "67",
//     value: "358",
//     label: "+358 FI",
//   },
//   {
//     id: "68",
//     value: "33",
//     label: "+33 FR",
//   },
//   {
//     id: "69",
//     value: "594",
//     label: "+594 GF",
//   },
//   {
//     id: "70",
//     value: "689",
//     label: "+689 PF",
//   },

//   {
//     id: "71",
//     value: "241",
//     label: "+241 GA",
//   },
//   {
//     id: "72",
//     value: "220",
//     label: "+220 GM",
//   },
//   {
//     id: "73",
//     value: "995",
//     label: "+995 GE",
//   },
//   {
//     id: "74",
//     value: "49",
//     label: "+49 DE",
//   },
//   {
//     id: "75",
//     value: "233",
//     label: "+233 GH",
//   },
//   {
//     id: "76",
//     value: "350",
//     label: "+350 GI",
//   },
//   {
//     id: "77",
//     value: "30",
//     label: "+30 GR",
//   },
//   {
//     id: "78",
//     value: "299",
//     label: "+299 GL",
//   },
//   {
//     id: "79",
//     value: "1809",
//     label: "+1809 DO",
//   },
//   {
//     id: "80",
//     value: "590",
//     label: "+590 GP",
//   },

//   {
//     id: "81",
//     value: "671",
//     label: "+671 GU",
//   },
//   {
//     id: "82",
//     value: "502",
//     label: "+502 GT",
//   },
//   {
//     id: "84",
//     value: "675",
//     label: "+675 PG",
//   },
//   {
//     id: "85",
//     value: "245",
//     label: "+245 GW",
//   },
//   {
//     id: "86",
//     value: "592",
//     label: "+592 GF",
//   },
//   {
//     id: "87",
//     value: "509",
//     label: "+509 HT",
//   },
//   {
//     id: "88",
//     value: "504",
//     label: "+504 HN",
//   },
//   {
//     id: "89",
//     value: "852",
//     label: "+852 HK",
//   },
//   {
//     id: "90",
//     value: "36",
//     label: "+36 HU",
//   },
//   {
//     id: "91",
//     value: "354",
//     label: "+354 IS",
//   },

//   {
//     id: "92",
//     value: "91",
//     label: "+91 IN",
//   },
//   {
//     id: "93",
//     value: "62",
//     label: "+62 ID	",
//   },
//   {
//     id: "94",
//     value: "98",
//     label: "+98 IR",
//   },
//   {
//     id: "95",
//     value: "964",
//     label: "+964 IQ",
//   },
//   {
//     id: "96",
//     value: "353",
//     label: "+353 IE",
//   },
//   {
//     id: "97",
//     value: "972",
//     label: "+972 IL",
//   },
//   {
//     id: "98",
//     value: "39",
//     label: "+39 IT",
//   },
//   {
//     id: "99",
//     value: "1876",
//     label: "+1876 JM",
//   },
//   {
//     id: "100",
//     value: "81",
//     label: "+81 JP",
//   },
//   {
//     id: "101",
//     value: "962",
//     label: "+962 JO",
//   },

//   {
//     id: "102",
//     value: "7",
//     label: "+7 RU",
//   },
//   {
//     id: "103",
//     value: "254",
//     label: "+254 KE	",
//   },
//   {
//     id: "104",
//     value: "850",
//     label: "+850 KP",
//   },
//   {
//     id: "105",
//     value: "82",
//     label: "+82 KR",
//   },
//   {
//     id: "106",
//     value: "381",
//     label: "+381 RS",
//   },
//   {
//     id: "107",
//     value: "965",
//     label: "+965 KW",
//   },
//   {
//     id: "108",
//     value: "996",
//     label: "+996 KG",
//   },
//   {
//     id: "109",
//     value: "856",
//     label: "+856 LA",
//   },
//   {
//     id: "110",
//     value: "371",
//     label: "+371 LV",
//   },
//   {
//     id: "111",
//     value: "961",
//     label: "+961 LB",
//   },

//   {
//     id: "112",
//     value: "266",
//     label: "+266 LS",
//   },
//   {
//     id: "113",
//     value: "231",
//     label: "+231 LR",
//   },
//   {
//     id: "114",
//     value: "218",
//     label: "+218 LY",
//   },
//   {
//     id: "115",
//     value: "423",
//     label: "+423 LI",
//   },
//   {
//     id: "116",
//     value: "370",
//     label: "+370 LT",
//   },
//   {
//     id: "117",
//     value: "352",
//     label: "+352 LU",
//   },
//   {
//     id: "118",
//     value: "853",
//     label: "+853 MO",
//   },
//   {
//     id: "119",
//     value: "389",
//     label: "+389 MK",
//   },
//   {
//     id: "120",
//     value: "261",
//     label: "+261 MG",
//   },
//   {
//     id: "121",
//     value: "265",
//     label: "+265 MW",
//   },

//   {
//     id: "122",
//     value: "60",
//     label: "+60 MY",
//   },
//   {
//     id: "123",
//     value: "960",
//     label: "+960 MV",
//   },
//   {
//     id: "124",
//     value: "223",
//     label: "+223 ML",
//   },
//   {
//     id: "125",
//     value: "356",
//     label: "+356 MT",
//   },
//   {
//     id: "126",
//     value: "596",
//     label: "+596 MQ",
//   },
//   {
//     id: "127",
//     value: "222",
//     label: "+222 MR",
//   },
//   {
//     id: "128",
//     value: "230",
//     label: "+230 MU",
//   },
//   {
//     id: "129",
//     value: "52",
//     label: "+52 MX",
//   },
//   {
//     id: "130",
//     value: "373",
//     label: "+373 MD",
//   },
//   {
//     id: "131",
//     value: "377",
//     label: "+377 MC",
//   },

//   {
//     id: "132",
//     value: "976",
//     label: "+976 MN",
//   },
//   {
//     id: "133",
//     value: "382",
//     label: "+382 ME",
//   },
//   {
//     id: "134",
//     value: "1664",
//     label: "+1664 MS",
//   },
//   {
//     id: "135",
//     value: "212",
//     label: "+212 MA",
//   },
//   {
//     id: "136",
//     value: "258",
//     label: "+258 MZ",
//   },
//   {
//     id: "137",
//     value: "95",
//     label: "+95 MM",
//   },
//   {
//     id: "138",
//     value: "264",
//     label: "+264 NA",
//   },
//   {
//     id: "139",
//     value: "977",
//     label: "+977 NE",
//   },
//   {
//     id: "140",
//     value: "31",
//     label: "+31 NL",
//   },
//   {
//     id: "141",
//     value: "599",
//     label: "+599 AN",
//   },

//   {
//     id: "142",
//     value: "687",
//     label: "+687 NC",
//   },
//   {
//     id: "143",
//     value: "64",
//     label: "+64 NZ",
//   },
//   {
//     id: "144",
//     value: "505",
//     label: "+505 NI",
//   },
//   {
//     id: "145",
//     value: "227",
//     label: "+227 NE",
//   },
//   {
//     id: "146",
//     value: "234",
//     label: "+234 NG",
//   },
//   {
//     id: "147",
//     value: "47",
//     label: "+47 NO",
//   },
//   {
//     id: "148",
//     value: "968",
//     label: "+968 OM",
//   },
//   {
//     id: "149",
//     value: "92",
//     label: "+92 PK",
//   },
//   {
//     id: "150",
//     value: "680",
//     label: "+680 PW",
//   },
//   {
//     id: "151",
//     value: "507",
//     label: "+507 PA",
//   },

//   {
//     id: "152",
//     value: "595",
//     label: "+595 PY",
//   },
//   {
//     id: "153",
//     value: "51",
//     label: "+51 PE",
//   },
//   {
//     id: "154",
//     value: "63",
//     label: "+63 PH",
//   },
//   {
//     id: "155",
//     value: "48",
//     label: "+48 PL",
//   },
//   {
//     id: "156",
//     value: "351",
//     label: "+351 PT",
//   },
//   {
//     id: "157",
//     value: "1787",
//     label: "+1787 PR",
//   },
//   {
//     id: "158",
//     value: "974",
//     label: "+974 QA",
//   },
//   {
//     id: "159",
//     value: "262",
//     label: "+262 RE",
//   },
//   {
//     id: "160",
//     value: "40",
//     label: "+40 RO",
//   },
//   {
//     id: "161",
//     value: "250",
//     label: "+250 RW",
//   },

//   {
//     id: "162",
//     value: "1869",
//     label: "+1869 KN",
//   },
//   {
//     id: "163",
//     value: "1758",
//     label: "+1758 LC",
//   },
//   {
//     id: "164",
//     value: "1784",
//     label: "+1784 VC",
//   },
//   {
//     id: "165",
//     value: "378",
//     label: "+378 SM",
//   },
//   {
//     id: "166",
//     value: "966",
//     label: "+966 SA",
//   },
//   {
//     id: "167",
//     value: "221",
//     label: "+221 SN",
//   },
//   {
//     id: "168",
//     value: "248",
//     label: "+248 SC",
//   },
//   {
//     id: "169",
//     value: "232",
//     label: "+232 SL",
//   },
//   {
//     id: "170",
//     value: "65",
//     label: "+65 SG",
//   },
//   {
//     id: "171",
//     value: "421",
//     label: "+421 SK",
//   },

//   {
//     id: "172",
//     value: "386",
//     label: "+386 SI",
//   },
//   {
//     id: "173",
//     value: "677",
//     label: "+677 SB",
//   },
//   {
//     id: "174",
//     value: "252",
//     label: "+252 SO",
//   },
//   {
//     id: "175",
//     value: "27",
//     label: "+27 ZA",
//   },
//   {
//     id: "176",
//     value: "211",
//     label: "+211 SS",
//   },
//   {
//     id: "177",
//     value: "34",
//     label: "+34 ES",
//   },
//   {
//     id: "178",
//     value: "94",
//     label: "+94 LK",
//   },
//   {
//     id: "179",
//     value: "249",
//     label: "+249 SD",
//   },
//   {
//     id: "180",
//     value: "597",
//     label: "+597 SR",
//   },
//   {
//     id: "181",
//     value: "268",
//     label: "+268 SZ",
//   },

//   {
//     id: "182",
//     value: "46",
//     label: "+46 SE",
//   },
//   {
//     id: "183",
//     value: "41",
//     label: "+41 CH",
//   },
//   {
//     id: "184",
//     value: "963",
//     label: "+963 SY",
//   },
//   {
//     id: "185",
//     value: "886",
//     label: "+886 TW",
//   },
//   {
//     id: "186",
//     value: "992",
//     label: "+992 TJ",
//   },
//   {
//     id: "187",
//     value: "255",
//     label: "+255 TZ",
//   },
//   {
//     id: "188",
//     value: "66",
//     label: "+66 TH",
//   },
//   {
//     id: "189",
//     value: "670",
//     label: "+670 TL",
//   },
//   {
//     id: "190",
//     value: "228",
//     label: "+228 TG",
//   },
//   {
//     id: "191",
//     value: "676",
//     label: "+676 TO",
//   },

//   {
//     id: "192",
//     value: "216",
//     label: "+216 TN",
//   },
//   {
//     id: "193",
//     value: "90",
//     label: "+90 TR",
//   },
//   {
//     id: "194",
//     value: "993",
//     label: "+993 TM",
//   },
//   {
//     id: "195",
//     value: "1649",
//     label: "+1649 TC",
//   },
//   {
//     id: "196",
//     value: "256",
//     label: "+256 UG",
//   },
//   {
//     id: "197",
//     value: "380",
//     label: "+380 UA",
//   },
//   {
//     id: "198",
//     value: "971",
//     label: "+971 AE",
//   },
//   {
//     id: "199",
//     value: "598",
//     label: "+598 UY",
//   },
//   {
//     id: "200",
//     value: "998",
//     label: "+998 UZ",
//   },
//   {
//     id: "201",
//     value: "678",
//     label: "+678 VU",
//   },

//   {
//     id: "202",
//     value: "58",
//     label: "+58 VE",
//   },
//   {
//     id: "203",
//     value: "84",
//     label: "+84 VN",
//   },
//   {
//     id: "204",
//     value: "1340",
//     label: "+1340 VG",
//   },
//   {
//     id: "205",
//     value: "967",
//     label: "+967 YE",
//   },
//   {
//     id: "206",
//     value: "260",
//     label: "+260 ZM",
//   },
//   {
//     id: "207",
//     value: "263",
//     label: "+263 ZW",
//   },
//   {
//     id: "208",
//     value: "1",
//     label: "+1 CA",
//   },
//   {
//     id: "209",
//     value: "44",
//     label: "+44 GB",
//   },
//   {
//     id: "210",
//     value: "1868",
//     label: "+1868 TT",
//   },
//   {
//     id: "211",
//     value: "1829",
//     label: "+1829 DO",
//   },

//   {
//     id: "212",
//     value: "1849",
//     label: "+1849 DO",
//   },
//   {
//     id: "213",
//     value: "1473",
//     label: "+1473 GD",
//   },
//   {
//     id: "214",
//     value: "7",
//     label: "+7 KZ",
//   },
//   {
//     id: "215",
//     value: "688",
//     label: "+688 TV",
//   },
//   {
//     id: "216",
//     value: "224",
//     label: "+224 GN",
//   },
// ];

const codePhoneOptionsPre = [
  {
    id: "1",
    value: "86",
    label: "+86 CN",
    longName: "China",
  },
  {
    id: "2",
    value: "61",
    label: "+61 AU",
    longName: "Australia",
  },
  {
    id: "3",
    value: "93",
    label: "+93 AF",
    longName: "Afghanistan",
  },
  {
    id: "4",
    value: "355",
    label: "+355 AL",
    longName: "Albania",
  },
  {
    id: "5",
    value: "213",
    label: "+213 DZ",
    longName: "Algeria",
  },
  {
    id: "6",
    value: "684",
    label: "+684 WS",
    longName: "Samoa",
  },
  {
    id: "7",
    value: "376",
    label: "+376 AD",
    longName: "Andorra",
  },
  {
    id: "8",
    value: "244",
    label: "+244 AO",
    longName: "Angola",
  },
  {
    id: "9",
    value: "1264",
    label: "+1264 AI",
    longName: "Anguilla",
  },
  {
    id: "10",
    value: "1268",
    label: "+1268 AG",
    longName: "Antigua and Barbuda",
  },
  {
    id: "11",
    value: "54",
    label: "+54 AR",
    longName: "Argentina",
  },
  {
    id: "12",
    value: "374",
    label: "+374 AM",
    longName: "Armenia",
  },
  {
    id: "13",
    value: "297",
    label: "+297 AW",
    longName: "Aruba",
  },
  {
    id: "14",
    value: "43",
    label: "+43 AT",
    longName: "Austria",
  },
  {
    id: "15",
    value: "994",
    label: "+994 AZ",
    longName: "Azerbaijan",
  },
  {
    id: "16",
    value: "1242",
    label: "+1242 BS",
    longName: "Bahamas",
  },
  {
    id: "17",
    value: "973",
    label: "+973 BH",
    longName: "Bahrain",
  },
  {
    id: "18",
    value: "880",
    label: "+880 BD",
    longName: "Bangladesh",
  },
  {
    id: "19",
    value: "1246",
    label: "+1246 BB",
    longName: "Barbados",
  },
  {
    id: "20",
    value: "375",
    label: "+375 BY",
    longName: "Belarus",
  },
  {
    id: "21",
    value: "32",
    label: "+32 BE",
    longName: "Belgium",
  },
  {
    id: "22",
    value: "501",
    label: "+501 BZ",
    longName: "Belize",
  },
  {
    id: "23",
    value: "229",
    label: "+229 BJ",
    longName: "Benin",
  },
  {
    id: "24",
    value: "1441",
    label: "+1441 BM",
    longName: "Bermuda",
  },
  {
    id: "25",
    value: "975",
    label: "+975 BT",
    longName: "Bhutan",
  },

  {
    id: "26",
    value: "591",
    label: "+591 BO",
    longName: "Bolivia",
  },
  {
    id: "27",
    value: "387",
    label: "+387 BA",
    longName: "Bosnia and Herzegovina",
  },
  {
    id: "28",
    value: "267",
    label: "+267 BW",
    longName: "Botswana",
  },
  {
    id: "29",
    value: "55",
    label: "+55 BR",
    longName: "Brazil",
  },
  {
    id: "30",
    value: "673",
    label: "+673 BN",
    longName: "Brunei",
  },
  {
    id: "31",
    value: "359",
    label: "+359 BG",
    longName: "Bulgaria",
  },
  {
    id: "32",
    value: "226",
    label: "+226 BF",
    longName: "Burkina Faso",
  },
  {
    id: "33",
    value: "257",
    label: "+257 BI",
    longName: "Burundi",
  },
  {
    id: "34",
    value: "855",
    label: "+855 KH",
    longName: "Cambodia",
  },
  {
    id: "35",
    value: "237",
    label: "+237 CM",
    longName: "Cameroon",
  },
  {
    id: "36",
    value: "1",
    label: "+1 US",
    longName: "United States",
  },
  {
    id: "37",
    value: "238",
    label: "+238 CV",
    longName: "Cape Verde",
  },
  {
    id: "38",
    value: "1345",
    label: "+1345 KY",
    longName: "Cayman Islands",
  },
  {
    id: "39",
    value: "236",
    label: "+236 CF",
    longName: "Central African Republic",
  },
  {
    id: "40",
    value: "235",
    label: "+235 TD",
    longName: "Chad",
  },
  {
    id: "41",
    value: "56",
    label: "+56 CL",
    longName: "Chile",
  },
  {
    id: "42",
    value: "57",
    label: "+57 CO",
    longName: "Colombia",
  },
  {
    id: "43",
    value: "269",
    label: "+269 KM",
    longName: "Comoros",
  },
  {
    id: "44",
    value: "242",
    label: "+242 CG",
    longName: "Congo",
  },
  {
    id: "45",
    value: "243",
    label: "+243 CD",
    longName: "Democratic Republic of the Congo",
  },
  {
    id: "46",
    value: "682",
    label: "+682 CK",
    longName: "Cook Islands",
  },
  {
    id: "47",
    value: "506",
    label: "+506 CR",
    longName: "Costa Rica",
  },
  {
    id: "48",
    value: "225",
    label: "+225 CI",
    longName: "Ivory Coast",
  },
  {
    id: "49",
    value: "385",
    label: "+385 HR",
    longName: "Croatia",
  },
  {
    id: "50",
    value: "53",
    label: "+53 CU",
    longName: "Cuba",
  },

  {
    id: "51",
    value: "357",
    label: "+357 CY",
    longName: "Cyprus",
  },
  {
    id: "52",
    value: "420",
    label: "+420 CZ",
    longName: "Czech Republic",
  },
  {
    id: "53",
    value: "45",
    label: "+45 DK",
    longName: "Denmark",
  },
  {
    id: "54",
    value: "253",
    label: "+253 DJ",
    longName: "Djibouti",
  },
  {
    id: "55",
    value: "1767",
    label: "+1767 DM",
    longName: "Dominica",
  },
  {
    id: "56",
    value: "1890",
    label: "+1890 DO",
    longName: "Dominican Republic",
  },
  {
    id: "57",
    value: "593",
    label: "+593 EC",
    longName: "Ecuador",
  },
  {
    id: "58",
    value: "20",
    label: "+20 EG",
    longName: "Egypt",
  },
  {
    id: "59",
    value: "503",
    label: "+503 SV",
    longName: "El Salvador",
  },
  {
    id: "60",
    value: "240",
    label: "+240 GQ",
    longName: "Equatorial Guinea",
  },

  {
    id: "61",
    value: "291",
    label: "+291 ER",
    longName: "Eritrea",
  },
  {
    id: "62",
    value: "372",
    label: "+372 EE",
    longName: "Estonia",
  },
  {
    id: "63",
    value: "251",
    label: "+251 ET",
    longName: "Ethiopia",
  },
  {
    id: "64",
    value: "500",
    label: "+500 FK",
    longName: "Falkland Islands",
  },
  {
    id: "65",
    value: "298",
    label: "+298 FO",
    longName: "Faroe Islands",
  },
  {
    id: "66",
    value: "679",
    label: "+679 FJ",
    longName: "Fiji",
  },
  {
    id: "67",
    value: "358",
    label: "+358 FI",
    longName: "Finland",
  },
  {
    id: "68",
    value: "33",
    label: "+33 FR",
    longName: "France",
  },
  {
    id: "69",
    value: "594",
    label: "+594 GF",
    longName: "French Guiana",
  },
  {
    id: "70",
    value: "689",
    label: "+689 PF",
    longName: "French Polynesia",
  },

  {
    id: "71",
    value: "241",
    label: "+241 GA",
    longName: "Gabon",
  },
  {
    id: "72",
    value: "220",
    label: "+220 GM",
    longName: "Gambia",
  },
  {
    id: "73",
    value: "995",
    label: "+995 GE",
    longName: "Georgia",
  },
  {
    id: "74",
    value: "49",
    label: "+49 DE",
    longName: "Germany",
  },
  {
    id: "75",
    value: "233",
    label: "+233 GH",
    longName: "Ghana",
  },
  {
    id: "76",
    value: "350",
    label: "+350 GI",
    longName: "Gibraltar",
  },
  {
    id: "77",
    value: "30",
    label: "+30 GR",
    longName: "Greece",
  },
  {
    id: "78",
    value: "299",
    label: "+299 GL",
    longName: "Greenland",
  },
  {
    id: "79",
    value: "1809",
    label: "+1809 DO",
    longName: "Dominican Republic",
  },
  {
    id: "80",
    value: "590",
    label: "+590 GP",
    longName: "Guadeloupe",
  },
  {
    id: "81",
    value: "671",
    label: "+671 GU",
    longName: "Guam",
  },
  {
    id: "82",
    value: "502",
    label: "+502 GT",
    longName: "Guatemala",
  },
  {
    id: "84",
    value: "675",
    label: "+675 PG",
    longName: "Papua New Guinea",
  },
  {
    id: "85",
    value: "245",
    label: "+245 GW",
    longName: "Guinea-Bissau",
  },
  {
    id: "86",
    value: "592",
    label: "+592 GF",
    longName: "Guyana",
  },
  {
    id: "87",
    value: "509",
    label: "+509 HT",
    longName: "Haiti",
  },
  {
    id: "88",
    value: "504",
    label: "+504 HN",
    longName: "Honduras",
  },
  {
    id: "89",
    value: "852",
    label: "+852 HK",
    longName: "Hong Kong",
  },
  {
    id: "90",
    value: "36",
    label: "+36 HU",
    longName: "Hungary",
  },
  {
    id: "91",
    value: "354",
    label: "+354 IS",
    longName: "Iceland",
  },
  {
    id: "92",
    value: "91",
    label: "+91 IN",
    longName: "India",
  },
  {
    id: "93",
    value: "62",
    label: "+62 ID ",
    longName: "Indonesia",
  },
  {
    id: "94",
    value: "98",
    label: "+98 IR",
    longName: "Iran",
  },
  {
    id: "95",
    value: "964",
    label: "+964 IQ",
    longName: "Iraq",
  },
  {
    id: "96",
    value: "353",
    label: "+353 IE",
    longName: "Ireland",
  },
  {
    id: "97",
    value: "972",
    label: "+972 IL",
    longName: "Israel",
  },
  {
    id: "98",
    value: "39",
    label: "+39 IT",
    longName: "Italy",
  },
  {
    id: "99",
    value: "1876",
    label: "+1876 JM",
    longName: "Jamaica",
  },
  {
    id: "100",
    value: "81",
    label: "+81 JP",
    longName: "Japan",
  },
  {
    id: "101",
    value: "962",
    label: "+962 JO",
    longName: "Jordan",
  },
  {
    id: "102",
    value: "7",
    label: "+7 RU",
    longName: "Russia",
  },
  {
    id: "103",
    value: "254",
    label: "+254 KE",
    longName: "Kenya",
  },
  {
    id: "104",
    value: "850",
    label: "+850 KP",
    longName: "North Korea",
  },
  {
    id: "105",
    value: "82",
    label: "+82 KR",
    longName: "South Korea",
  },
  {
    id: "106",
    value: "381",
    label: "+381 RS",
    longName: "Serbia",
  },
  {
    id: "107",
    value: "965",
    label: "+965 KW",
    longName: "Kuwait",
  },
  {
    id: "108",
    value: "996",
    label: "+996 KG",
    longName: "Kyrgyzstan",
  },
  {
    id: "109",
    value: "856",
    label: "+856 LA",
    longName: "Laos",
  },
  {
    id: "110",
    value: "371",
    label: "+371 LV",
    longName: "Latvia",
  },
  {
    id: "111",
    value: "961",
    label: "+961 LB",
    longName: "Lebanon",
  },
  {
    id: "112",
    value: "266",
    label: "+266 LS",
    longName: "Lesotho",
  },
  {
    id: "113",
    value: "231",
    label: "+231 LR",
    longName: "Liberia",
  },
  {
    id: "114",
    value: "218",
    label: "+218 LY",
    longName: "Libya",
  },
  {
    id: "115",
    value: "423",
    label: "+423 LI",
    longName: "Liechtenstein",
  },
  {
    id: "116",
    value: "370",
    label: "+370 LT",
    longName: "Lithuania",
  },
  {
    id: "117",
    value: "352",
    label: "+352 LU",
    longName: "Luxembourg",
  },
  {
    id: "118",
    value: "853",
    label: "+853 MO",
    longName: "Macau",
  },
  {
    id: "119",
    value: "389",
    label: "+389 MK",
    longName: "North Macedonia",
  },
  {
    id: "120",
    value: "261",
    label: "+261 MG",
    longName: "Madagascar",
  },
  {
    id: "121",
    value: "265",
    label: "+265 MW",
    longName: "Malawi",
  },
  {
    id: "122",
    value: "60",
    label: "+60 MY",
    longName: "Malaysia",
  },
  {
    id: "123",
    value: "960",
    label: "+960 MV",
    longName: "Maldives",
  },
  {
    id: "124",
    value: "223",
    label: "+223 ML",
    longName: "Mali",
  },
  {
    id: "125",
    value: "356",
    label: "+356 MT",
    longName: "Malta",
  },
  {
    id: "126",
    value: "596",
    label: "+596 MQ",
    longName: "Martinique",
  },
  {
    id: "127",
    value: "222",
    label: "+222 MR",
    longName: "Mauritania",
  },
  {
    id: "128",
    value: "230",
    label: "+230 MU",
    longName: "Mauritius",
  },
  {
    id: "129",
    value: "52",
    label: "+52 MX",
    longName: "Mexico",
  },
  {
    id: "130",
    value: "373",
    label: "+373 MD",
    longName: "Moldova",
  },
  {
    id: "131",
    value: "377",
    label: "+377 MC",
    longName: "Monaco",
  },
  {
    id: "132",
    value: "976",
    label: "+976 MN",
    longName: "Mongolia",
  },
  {
    id: "133",
    value: "382",
    label: "+382 ME",
    longName: "Montenegro",
  },
  {
    id: "134",
    value: "1664",
    label: "+1664 MS",
    longName: "Montserrat",
  },
  {
    id: "135",
    value: "212",
    label: "+212 MA",
    longName: "Morocco",
  },
  {
    id: "136",
    value: "258",
    label: "+258 MZ",
    longName: "Mozambique",
  },
  {
    id: "137",
    value: "95",
    label: "+95 MM",
    longName: "Myanmar",
  },
  {
    id: "138",
    value: "264",
    label: "+264 NA",
    longName: "Namibia",
  },
  {
    id: "139",
    value: "977",
    label: "+977 NE",
    longName: "Nepal",
  },
  {
    id: "140",
    value: "31",
    label: "+31 NL",
    longName: "Netherlands",
  },
  {
    id: "141",
    value: "599",
    label: "+599 AN",
    longName: "Netherlands Antilles",
  },
  {
    id: "142",
    value: "687",
    label: "+687 NC",
    longName: "New Caledonia",
  },
  {
    id: "143",
    value: "64",
    label: "+64 NZ",
    longName: "New Zealand",
  },
  {
    id: "144",
    value: "505",
    label: "+505 NI",
    longName: "Nicaragua",
  },
  {
    id: "145",
    value: "227",
    label: "+227 NE",
    longName: "Niger",
  },
  {
    id: "146",
    value: "234",
    label: "+234 NG",
    longName: "Nigeria",
  },
  {
    id: "147",
    value: "47",
    label: "+47 NO",
    longName: "Norway",
  },
  {
    id: "148",
    value: "968",
    label: "+968 OM",
    longName: "Oman",
  },
  {
    id: "149",
    value: "92",
    label: "+92 PK",
    longName: "Pakistan",
  },
  {
    id: "150",
    value: "680",
    label: "+680 PW",
    longName: "Palau",
  },
  {
    id: "151",
    value: "507",
    label: "+507 PA",
    longName: "Panama",
  },
  {
    id: "152",
    value: "595",
    label: "+595 PY",
    longName: "Paraguay",
  },
  {
    id: "153",
    value: "51",
    label: "+51 PE",
    longName: "Peru",
  },
  {
    id: "154",
    value: "63",
    label: "+63 PH",
    longName: "Philippines",
  },
  {
    id: "155",
    value: "48",
    label: "+48 PL",
    longName: "Poland",
  },
  {
    id: "156",
    value: "351",
    label: "+351 PT",
    longName: "Portugal",
  },
  {
    id: "157",
    value: "1787",
    label: "+1787 PR",
    longName: "Puerto Rico",
  },
  {
    id: "158",
    value: "974",
    label: "+974 QA",
    longName: "Qatar",
  },
  {
    id: "159",
    value: "262",
    label: "+262 RE",
    longName: "Reunion",
  },
  {
    id: "160",
    value: "40",
    label: "+40 RO",
    longName: "Romania",
  },
  {
    id: "161",
    value: "250",
    label: "+250 RW",
    longName: "Rwanda",
  },
  {
    id: "162",
    value: "1869",
    label: "+1869 KN",
    longName: "Saint Kitts and Nevis",
  },
  {
    id: "163",
    value: "1758",
    label: "+1758 LC",
    longName: "Saint Lucia",
  },
  {
    id: "164",
    value: "1784",
    label: "+1784 VC",
    longName: "Saint Vincent and the Grenadines",
  },
  {
    id: "165",
    value: "378",
    label: "+378 SM",
    longName: "San Marino",
  },
  {
    id: "166",
    value: "966",
    label: "+966 SA",
    longName: "Saudi Arabia",
  },
  {
    id: "167",
    value: "221",
    label: "+221 SN",
    longName: "Senegal",
  },
  {
    id: "168",
    value: "248",
    label: "+248 SC",
    longName: "Seychelles",
  },
  {
    id: "169",
    value: "232",
    label: "+232 SL",
    longName: "Sierra Leone",
  },
  {
    id: "170",
    value: "65",
    label: "+65 SG",
    longName: "Singapore",
  },
  {
    id: "171",
    value: "421",
    label: "+421 SK",
    longName: "Slovakia",
  },
  {
    id: "172",
    value: "386",
    label: "+386 SI",
    longName: "Slovenia",
  },
  {
    id: "173",
    value: "677",
    label: "+677 SB",
    longName: "Solomon Islands",
  },
  {
    id: "174",
    value: "252",
    label: "+252 SO",
    longName: "Somalia",
  },
  {
    id: "175",
    value: "27",
    label: "+27 ZA",
    longName: "South Africa",
  },
  {
    id: "176",
    value: "211",
    label: "+211 SS",
    longName: "South Sudan",
  },
  {
    id: "177",
    value: "34",
    label: "+34 ES",
    longName: "Spain",
  },
  {
    id: "178",
    value: "94",
    label: "+94 LK",
    longName: "Sri Lanka",
  },
  {
    id: "179",
    value: "249",
    label: "+249 SD",
    longName: "Sudan",
  },
  {
    id: "180",
    value: "597",
    label: "+597 SR",
    longName: "Suriname",
  },
  {
    id: "181",
    value: "268",
    label: "+268 SZ",
    longName: "Eswatini",
  },
  {
    id: "182",
    value: "46",
    label: "+46 SE",
    longName: "Sweden",
  },
  {
    id: "183",
    value: "41",
    label: "+41 CH",
    longName: "Switzerland",
  },
  {
    id: "184",
    value: "963",
    label: "+963 SY",
    longName: "Syria",
  },
  {
    id: "185",
    value: "886",
    label: "+886 TW",
    longName: "Taiwan",
  },
  {
    id: "186",
    value: "992",
    label: "+992 TJ",
    longName: "Tajikistan",
  },
  {
    id: "187",
    value: "255",
    label: "+255 TZ",
    longName: "Tanzania",
  },
  {
    id: "188",
    value: "66",
    label: "+66 TH",
    longName: "Thailand",
  },
  {
    id: "189",
    value: "670",
    label: "+670 TL",
    longName: "Timor-Leste",
  },
  {
    id: "190",
    value: "228",
    label: "+228 TG",
    longName: "Togo",
  },
  {
    id: "191",
    value: "676",
    label: "+676 TO",
    longName: "Tonga",
  },
  {
    id: "192",
    value: "216",
    label: "+216 TN",
    longName: "Tunisia",
  },
  {
    id: "193",
    value: "90",
    label: "+90 TR",
    longName: "Turkey",
  },
  {
    id: "194",
    value: "993",
    label: "+993 TM",
    longName: "Turkmenistan",
  },
  {
    id: "195",
    value: "1649",
    label: "+1649 TC",
    longName: "Turks and Caicos Islands",
  },
  {
    id: "196",
    value: "256",
    label: "+256 UG",
    longName: "Uganda",
  },
  {
    id: "197",
    value: "380",
    label: "+380 UA",
    longName: "Ukraine",
  },
  {
    id: "198",
    value: "971",
    label: "+971 AE",
    longName: "United Arab Emirates",
  },
  {
    id: "199",
    value: "598",
    label: "+598 UY",
    longName: "Uruguay",
  },
  {
    id: "200",
    value: "998",
    label: "+998 UZ",
    longName: "Uzbekistan",
  },
  {
    id: "201",
    value: "678",
    label: "+678 VU",
    longName: "Vanuatu",
  },
  {
    id: "202",
    value: "58",
    label: "+58 VE",
    longName: "Venezuela",
  },
  {
    id: "203",
    value: "84",
    label: "+84 VN",
    longName: "Vietnam",
  },
  {
    id: "204",
    value: "1340",
    label: "+1340 VG",
    longName: "British Virgin Islands",
  },
  {
    id: "205",
    value: "967",
    label: "+967 YE",
    longName: "Yemen",
  },
  {
    id: "206",
    value: "260",
    label: "+260 ZM",
    longName: "Zambia",
  },
  {
    id: "207",
    value: "263",
    label: "+263 ZW",
    longName: "Zimbabwe",
  },
  {
    id: "208",
    value: "1",
    label: "+1 CA",
    longName: "Canada",
  },
  {
    id: "209",
    value: "44",
    label: "+44 GB",
    longName: "United Kingdom",
  },
  {
    id: "210",
    value: "1868",
    label: "+1868 TT",
    longName: "Trinidad and Tobago",
  },
  {
    id: "211",
    value: "1829",
    label: "+1829 DO",
    longName: "Dominican Republic",
  },
  {
    id: "212",
    value: "1849",
    label: "+1849 DO",
    longName: "Dominican Republic",
  },
  {
    id: "213",
    value: "1473",
    label: "+1473 GD",
    longName: "Grenada",
  },
  {
    id: "214",
    value: "7",
    label: "+7 KZ",
    longName: "Kazakhstan",
  },
  {
    id: "215",
    value: "688",
    label: "+688 TV",
    longName: "Tuvalu",
  },
  {
    id: "216",
    value: "224",
    label: "+224 GN",
    longName: "Guinea",
  },
];

export const codePhoneOptions = codePhoneOptionsPre.map((data) => {
  const arr = data.label.split(" ");

  arr[1] = data.longName;

  const finalStr = arr.join(" ");

  return { ...data, label: finalStr };
});

export const CardRegisterForm = ({ cardId, cardCurr, cardName, cardType }) => {
  const dispatch = useDispatch();
  const { userWallet } = useSelector((state) => state.coinReducer);
  const { listCoinRealTime } = useSelector(
    (state) => state.listCoinRealTimeReducer
  );
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const [isLoading, setIsLoading] = useState(false);
  const [codePhone, setCodePhone] = useState("84");
  const history = useHistory();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [errorsMsg, setErrorsMsg] = useState({
    firstName: null,
    lastName: null,
    phone: null,
  });
  const isDisabledBtn =
    formData.firstName === "" ||
    formData.lastName === "" ||
    formData.phone === "" ||
    errorsMsg.firstName ||
    errorsMsg.lastName ||
    errorsMsg.phone;
  const { t } = useTranslation();

  const isEngChar = (value) => {
    const reg = /^[a-zA-Z ]+$/;

    if (!reg.test(value)) {
      return false;
    }

    return true;
  };

  function isPositiveInteger(value) {
    return Number.isInteger(value) && value >= 0;
  }

  const getWalletGlobal = async () => {
    try {
      const res = await axiosService.post("api/user/getWallet");

      dispatch({
        type: GLOBAL_TYPE.UPDATE_BALANCES,
        payload: res.data.data,
      });
    } catch (error) {}
  };

  const handleChangeField = (field) => (e) => {
    const value = e.target.value;

    setFormData({ ...formData, [field]: value });

    let errorsTemp = {
      firstName: null,
      lastName: null,
      phone: null,
    };

    if (field === "firstName" && value !== "" && !isEngChar(value)) {
      message.destroy();
      message.error(t("createVisaCard.t2"));
      errorsTemp.firstName = true;
    } else {
      errorsTemp.firstName = false;
    }

    if (field === "lastName" && value !== "" && !isEngChar(value)) {
      message.destroy();
      message.error(t("createVisaCard.t3"));
      errorsTemp.lastName = true;
    } else {
      errorsTemp.lastName = false;
    }

    if (
      field === "phone" &&
      value !== "" &&
      !isPositiveInteger(Number(value))
    ) {
      message.destroy();
      message.error(t("createVisaCard.t4"));
      errorsTemp.phone = true;
    } else {
      errorsTemp.phone = false;
    }

    setErrorsMsg(errorsTemp);
  };

  const handleChangePhone = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const renderCardType = (cardType) => {
    switch (Number(cardType)) {
      case 1:
        return "Virtual";

      case 2:
        return "Physical";

      default:
        return null;
    }
  };

  const handleChangeCodePhone = (value) => {
    setCodePhone(value);
  };

  const handleClearData = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
    });
    setErrorsMsg({
      firstName: null,
      lastName: null,
      phone: null,
    });
  };

  const handleGetWallet = async () => {
    try {
      const res = await axiosService.post("api/user/getWallet");

      const apiResp = res.data.data;
      const result = {};
      for (const [name, value] of Object.entries(apiResp)) {
        let price =
          listCoinRealTime.filter(
            (item) => item.name === name.replace("_balance", "").toUpperCase()
          )[0]?.price ?? 0;
        result[name] = roundDownDecimalValues(value, price);
      }
      if (Object.keys(result)) {
        userWallet.current = result;
        dispatch(coinUserWallet(result));
      }
    } catch (error) {}
  };

  const handleCreateVisaAPI = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const res = await axiosService.post("api/visaCard/createCardApplyType2", {
        card_type_id: Number(cardId).toString(), /// lấy ở list card
        first_name: formData.firstName, ///Validation không dấu
        last_name: formData.lastName, ///Validation không dấu
        mobile: formData.phone,
        mobile_code: codePhone,
      });

      handleGetWallet();
      getWalletGlobal();
      setIsLoading(false);
      handleClearData();
      history.replace("/success-created-card");
    } catch (error) {
      message.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  if (!isLogin) {
    return null;
  }

  return (
    <div className="cardRegisterFormContainer">
      <div className="sectionNote">{t("createVisaCard.t5")}</div>

      <div className="sectionCard">
        <div className="titleInside">{t("createVisaCard.t6")}</div>
        <div className="descInside">
          <Descriptions
            className="customAntdDesc"
            bordered
            style={{ color: "#fff" }}
            column={1}
            size={window.innerWidth < 768 ? "small" : "default"}
          >
            <Descriptions.Item
              label={
                <div className="labelInsideV2">{t("createVisaCard.t7")}</div>
              }
            >
              <div className="contentInsideV2">{cardCurr.toUpperCase()}</div>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <div className="labelInsideV2">{t("createVisaCard.t8")}</div>
              }
            >
              <div className="contentInsideV2">{renderCardType(cardType)}</div>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <div className="labelInsideV2">{t("createVisaCard.t9")}</div>
              }
            >
              <div className="contentInsideV2">{cardName}</div>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      <div className="sectionPreview">
        <div className="titleInside">{t("createVisaCard.t10")}</div>

        <div className="previewCards">
          <CardItemVirtualFrontPreview />
          <CardItemVirtualBackPreview
            data={{
              first_name: formData.firstName,
              last_name: formData.lastName,
            }}
          />
        </div>
      </div>

      <div className="sectionInfo">
        <div className="titleInside">{t("createVisaCard.t11")}</div>
        {step === 1 && (
          <div className="formInside">
            {/* <div className="item">
              <div className="label">
                <span className="star">* </span>
                {t("createVisaCard.t12")}
              </div>
              <input value={cardId} readOnly className="inputInside" />
            </div> */}

            <div className="item">
              <div className="label">
                <span className="star">* </span>
                {t("createVisaCard.t13")}
              </div>
              <input
                className="inputInside"
                value={formData.firstName}
                onChange={handleChangeField("firstName")}
                placeholder={t("createVisaCard.t14")}
              />
            </div>

            <div className="item">
              <div className="label">
                <span className="star">* </span>
                {t("createVisaCard.t15")}
              </div>
              <input
                className="inputInside"
                value={formData.lastName}
                onChange={handleChangeField("lastName")}
                placeholder={t("createVisaCard.t16")}
              />
            </div>

            <div className="item">
              <div className="label">
                <span className="star">* </span>
                {t("createVisaCard.t17")}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flex: "1",
                }}
              >
                <Select
                  value={codePhone}
                  onChange={handleChangeCodePhone}
                  options={codePhoneOptions}
                />
                <input
                  style={{ flex: "1" }}
                  className="inputInside"
                  value={formData.phone}
                  onChange={handleChangeField("phone")}
                  placeholder={t("createVisaCard.t18")}
                />
              </div>
            </div>
          </div>
        )}

        {/* FEE SCREEN */}
        {step === 2 && <CardFeeScreen />}

        <button
          className={`btnInside ${isDisabledBtn ? "disabled" : ""}`}
          disabled={isDisabledBtn}
          onClick={handleCreateVisaAPI}
        >
          {isLoading ? (
            <Spin />
          ) : step === 1 ? (
            t("formRegisterType3.t39")
          ) : (
            t("createVisaCard.t19")
          )}
        </button>
      </div>
    </div>
  );
};
