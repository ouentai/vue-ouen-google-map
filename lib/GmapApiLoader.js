// window.handleLoadGmapAPIによって実行されるコールバックの配列
const funcs_arr = [] ;

// api読込が終わったときに呼ばれるコールバック
window.handleLoadGmapAPI = () => {
  // funcs_arrの要素を一つ一つ実行
  for (const func of funcs_arr) func() ;
}

/**
 * GoogleMapsApiLoader
 * シングルトン構造なので、paramsを変更して再呼び出しをしても、初回呼び出しと同じ結果になる
 *
 * @param Object params
 * ※とりあえずapiKey,languageだけ対応
 *
 * @return Promise resolve window.googleオブジェクト
 * @return Promise reject エラー
 */
export default function apiLoader(params = {}) {
  return new Promise((resolve, reject) => {
    // apiが読込まれている場合はwindow.googleを返す
    if (window.google) return resolve(window.google) ;

    funcs_arr.push(() => resolve(window.google)) ;

    // 初めての読込の時のみsrciptタグを追加する：配列の長さが1の時のみ
    if (funcs_arr.length===1) {
      // apiのurl設定
      let url = 'https://maps.googleapis.com/maps/api/js?' ;
      if (params.apiKey) url += `key=${params.apiKey}&` ;
      if (params.language) url += `language=${params.language}&` ;
      url += 'callback=handleLoadGmapAPI' ;
      // document.headにscriptタグを追加する
      const scriptTag = document.createElement('script') ;
      scriptTag.setAttribute('src', url) ;
      document.head.appendChild(scriptTag) ;
      setTimeout( () => {
        if (!window.google) reject(new Error('Loading Google API took too long')) ;
      }, 5000);
    }
//    window.handleLoadGmapAPI = () => resolve(window.google) ;

  });
}
