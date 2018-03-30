const CRYPTO = Object.freeze([
  'ADA',
  'ADX',
  'AION',
  'AMB',
  'ARK',
  'ARN',
  'BAT',
  'BCD',
  'BCH',
  'BCPT',
  'BNT',
  'BTG',
  'CTR',
  'CVC',
  'DASH',
  'DGB',
  'DNT',
  'DOGE',
  'ELF',
  'ENG',
  'ENJ',
  'EOS',
  'ETC',
  'ETH',
  'EVX',
  'GAS',
  'GNO',
  'GVT',
  'HSR',
  'ICN',
  'INS',
  'IOST',
  'KMD',
  'KNC',
  'LEND',
  'LRC',
  'LSK',
  'LTC',
  'LUN',
  'MANA',
  'MCO',
  'MLN',
  'MOD',
  'MTH',
  'NANO',
  'NAV',
  'NEBL',
  'NEO',
  'NULS',
  'OMG',
  'ONT',
  'PAY',
  'PIVX',
  'POE',
  'POWR',
  'PPT',
  'QLC',
  'QSP',
  'QTUM',
  'RCN',
  'RDN',
  'REP',
  'REQ',
  'RLC',
  'RPX',
  'SALT',
  'SNM',
  'SNT',
  'STEEM',
  'STORJ',
  'STRAT',
  'SUB',
  'SYS',
  'TRX',
  'UKG',
  'VEN',
  'VIA',
  'VIB',
  'WAVES',
  'WAX',
  'WINGS',
  'WTC',
  'XEM',
  'XLM',
  'XMR',
  'XRP',
  'XVG',
  'XZC',
  'ZEC',
  'ZIL',
  'ZRX'
]);

const BITTREX = Object.freeze([
  '1ST',
  '2GIVE',
  'ABY',
  'ADA',
  'ADT',
  'ADX',
  'AEON',
  'AGRS',
  'AMP',
  'ANT',
  'ARDR',
  'ARK',
  'AUR',
  'BAT',
  'BAY',
  'BCH',
  'BCPT',
  'BCY',
  'BITB',
  'BLITZ',
  'BLK',
  'BLOCK',
  'BNT',
  'BRK',
  'BRX',
  'BSD',
  'BTG',
  'BURST',
  'BYC',
  'CANN',
  'CFI',
  'CLAM',
  'CLOAK',
  'CLUB',
  'COVAL',
  'CPC',
  'CRB',
  'CRW',
  'CURE',
  'CVC',
  'DASH',
  'DCR',
  'DCT',
  'DGB',
  'DMD',
  'DNT',
  'DOGE',
  'DOPE',
  'DTB',
  'DYN',
  'EBST',
  'EDG',
  'EFL',
  'EGC',
  'EMC',
  'EMC2',
  'ENG',
  'ENRG',
  'ERC',
  'ETC',
  'ETH',
  'EXCL',
  'EXP',
  'FAIR',
  'FCT',
  'FLDC',
  'FLO',
  'FTC',
  'GAM',
  'GAME',
  'GBG',
  'GBYTE',
  'GCR',
  'GEO',
  'GLD',
  'GNO',
  'GNT',
  'GOLOS',
  'GRC',
  'GRS',
  'GUP',
  'HMQ',
  'INCNT',
  'INFX',
  'IOC',
  'ION',
  'IOP',
  'KMD',
  'KORE',
  'LBC',
  'LGD',
  'LMC',
  'LRC',
  'LSK',
  'LTC',
  'LUN',
  'MAID',
  'MANA',
  'MCO',
  'MEME',
  'MER',
  'MLN',
  'MONA',
  'MUE',
  'MUSIC',
  'NAV',
  'NBT',
  'NEO',
  'NEOS',
  'NLG',
  'NMR',
  'NXC',
  'NXS',
  'NXT',
  'OK',
  'OMG',
  'OMNI',
  'PART',
  'PAY',
  'PDC',
  'PINK',
  'PIVX',
  'PKB',
  'POT',
  'POWR',
  'PPC',
  'PTC',
  'PTOY',
  'QRL',
  'QTUM',
  'QWARK',
  'RADS',
  'RBY',
  'RCN',
  'RDD',
  'REP',
  'RISE',
  'RLC',
  'SALT',
  'SBD',
  'SC',
  'SEQ',
  'SHIFT',
  'SIB',
  'SLR',
  'SLS',
  'SNRG',
  'SNT',
  'SPHR',
  'SPR',
  'SRN',
  'START',
  'STEEM',
  'STORJ',
  'STRAT',
  'SWIFT',
  'SWT',
  'SYNX',
  'SYS',
  'THC',
  'TIX',
  'TKS',
  'TRST',
  'TRUST',
  'TRX',
  'TX',
  'UBQ',
  'UKG',
  'UNB',
  'VEE',
  'VIA',
  'VIB',
  'VOX',
  'VRC',
  'VRM',
  'VTC',
  'VTR',
  'WAVES',
  'WAX',
  'WINGS',
  'XCP',
  'XDN',
  'XEL',
  'XEM',
  'XLM',
  'XMG',
  'XMR',
  'XMY',
  'XRP',
  'XST',
  'XVC',
  'XVG',
  'XWC',
  'XZC',
  'ZCL',
  'ZEC',
  'ZEN',
  'ZRX'
]);

const BINANCE = Object.freeze([
  'ADA',
  'ADX',
  'AE',
  'AION',
  'AMB',
  'APPC',
  'ARK',
  'ARN',
  'AST',
  'BAT',
  'BCH',
  'BCD',
  'BCPT',
  'BLZ',
  'BNB',
  'BNT',
  'BQX',
  'BRD',
  'BTG',
  'BTS',
  'CDT',
  'CHAT',
  'CMT',
  'CND',
  'CTR',
  'DASH',
  'DGD',
  'DLT',
  'DNT',
  'EDO',
  'ELF',
  'ENG',
  'ENJ',
  'EOS',
  'ETC',
  'ETH',
  'EVX',
  'FUEL',
  'FUN',
  'GAS',
  'GTO',
  'GVT',
  'GXS',
  'HSR',
  'ICN',
  'ICX',
  'IGNIS',
  'INS',
  'IOST',
  'IOTA',
  'KMD',
  'KNC',
  'LEND',
  'LINK',
  'LRC',
  'LSK',
  'LTC',
  'LUN',
  'MANA',
  'NANO',
  'MCO',
  'MDA',
  'MOD',
  'MTH',
  'MTL',
  'NAV',
  'NCASH',
  'NEBL',
  'NEO',
  'NULS',
  'OAX',
  'OMG',
  'ONT',
  'OST',
  'PIVX',
  'POA',
  'POE',
  'POWR',
  'PPT',
  'QLC',
  'QSP',
  'QTUM',
  'RCN',
  'RDN',
  'REQ',
  'RLC',
  'RPX',
  'SALT',
  'SNGLS',
  'SNM',
  'SNT',
  'STEEM',
  'STORJ',
  'STRAT',
  'SUB',
  'SYS',
  'TNB',
  'TNT',
  'TRIG',
  'TRX',
  'VEN',
  'VIA',
  'VIB',
  'VIBE',
  'WABI',
  'WAN',
  'WAVES',
  'WINGS',
  'WTC',
  'XEM',
  'XLM',
  'XMR',
  'XRP',
  'XVG',
  'XZC',
  'YOYO',
  'ZEC',
  'ZIL',
  'ZRX'
]);

const KUCOIN = Object.freeze([
  'ACT',
  'AGI',
  'AION',
  'AIX',
  'AMB',
  'ARN',
  'BCD',
  'BCH',
  'BCPT',
  'BHC',
  'BNTY',
  'BTG',
  'BTM',
  'CAG',
  'CAN',
  'CAT',
  'CFD',
  'CTR',
  'CV',
  'CVC',
  'DASH',
  'DAT',
  'DBC',
  'DENT',
  'DGB',
  'DNA',
  'DRGN',
  'ELIX',
  'ELF',
  'ENJ',
  'EOS',
  'ETC',
  'ETH',
  'EVX',
  'FLIXX',
  'FOTA',
  'GAS',
  'GVT',
  'HSR',
  'HST',
  'INS',
  'IOST',
  'KCS',
  'KEY',
  'KNC',
  'LA',
  'LEND',
  'LTC',
  'MOD',
  'MTH',
  'NANO',
  'NEBL',
  'NEO',
  'NULS',
  'OCN',
  'OMG',
  'ONION',
  'ONT',
  'PAY',
  'PBL',
  'POE',
  'POLL',
  'POWR',
  'PPT',
  'PRL',
  'PURA',
  'QLC',
  'QSP',
  'QTUM',
  'R',
  'RDN',
  'REQ',
  'RHOC',
  'RPX',
  'SNM',
  'SNOV',
  'SNT',
  'STX',
  'SUB',
  'TEL',
  'TFL',
  'TIO',
  'TNC',
  'UKG',
  'UTK',
  'VEN',
  'WAX',
  'WTC',
  'XAS',
  'XLR',
  'XRB',
  'ZIL'
]);

const KRAKEN = Object.freeze([
  'BCH',
  'DASH',
  'DOGE',
  'EOS',
  'ETC',
  'ETH',
  'GNO',
  'ICN',
  'LTC',
  'MLN',
  'REP',
  'XLM',
  'XMR',
  'XRP',
  'ZEC'
]);

const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const TIME = Object.freeze({ SECOND, MINUTE, HOUR });

exports.CRYPTO = CRYPTO;
exports.BITTREX = BITTREX;
exports.BINANCE = BINANCE;
exports.KUCOIN = KUCOIN;
exports.KRAKEN = KRAKEN;
exports.TIME = TIME;
