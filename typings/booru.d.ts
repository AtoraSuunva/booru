declare namespace booru {
    function commonfy(images: any): any;

    function resolveSite(siteToResolve: any): any;

    function search(site: string, tags: Array<string>, { limit, random, credentials }: {limit?: number|string, random?:boolean, credentials?:object}): any;
    
    function _Booru(site: string, credentials: any): any;

    const sites: {
        "e621.net": {
          aliases: ["e6", "e621"],
          nsfw: true,
          random: true
        },
        "e926.net": {
          aliases: ["e9", "e926"],
          nsfw: false,
          random: true
        },
        "hypnohub.net": {
          aliases: ["hh", "hypo", "hypohub"],
          nsfw: true,
          random: true
        },
        "danbooru.donmai.us": {
          aliases: ["db", "dan", "danbooru"],
          nsfw: true,
          random: true
        },
        "konachan.com": {
          aliases: ["kc", "konac", "kcom"],
          nsfw: true,
          random: true
        },
        "konachan.net": {
          aliases: ["kn", "konan", "knet"],
          nsfw: false,
          random: true
        },
        "yande.re": {
          aliases: ["yd", "yand", "yandere"],
          nsfw: true,
          random: true
        },
        "gelbooru.com": {
          aliases: ["gb", "gel", "gelbooru"],
          nsfw: true,
          random: false
        },
        "rule34.xxx": {
          aliases: ["r34", "rule34"],
          nsfw: true,
          random: false
        },
        "safebooru.org": {
          aliases: ["sb", "safe", "safebooru"],
          nsfw: false,
          random: false
        },
        "tbib.org": {
          aliases: ["tb", "tbib", "big"],
          nsfw: false,
          random: false
        },
        "xbooru.com": {
          aliases: ["xb", "xbooru"],
          nsfw: true,
          random: false
        },
        "youhate.us": {
          aliases: ["yh", "you", "youhate"],
          nsfw: true,
          random: false
        },
        "lolibooru.moe": {
          aliases: ["lb", "lol", "loli", "lolibooru"],
          nsfw: true,
          random: true
        },
      
        "rule34.paheal.net": {
          "type": "xml",
          aliases: ["pa", "paheal"],
          nsfw: true,
          random: false
        },
        "derpibooru.org": {
          "type": "derpi",
          aliases: ["dp", "derp", "derpi", "derpibooru"],
          nsfw: true,
          random: true
        },
        "furry.booru.org": {
          aliases: ["fb", "furrybooru"],
          nsfw: true,
          random: false
        },
        "realbooru.com": {
          aliases: ["rb", "realbooru"],
          nsfw: true,
          random: false
        }
      }
}

export = booru;