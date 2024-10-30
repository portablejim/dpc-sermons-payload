

// this function is from the work of Taylor Hunt found at https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
export function encodeSvg(svgString) {
    return svgString.replace('<svg',(~svgString.indexOf('xmlns')?'<svg':'<svg xmlns="http://www.w3.org/2000/svg"'))
          
          //
          //   Encode (may need a few extra replacements)
          //
          .replace(/"/g, '\'')
          .replace(/%/g, '%25')
          .replace(/#/g, '%23')       
          .replace(/{/g, '%7B')
          .replace(/}/g, '%7D')         
          .replace(/</g, '%3C')
          .replace(/>/g, '%3E')
  
          .replace(/\s+/g,' ') 
          // 
          //    The maybe list (add on documented fail)
          // 
          //  .replace(/&/g, '%26')
          //  .replace('|', '%7C')
          //  .replace('[', '%5B')
          //  .replace(']', '%5D')
          //  .replace('^', '%5E')
          //  .replace('`', '%60')
          //  .replace(';', '%3B')
          //  .replace('?', '%3F')
          //  .replace(':', '%3A')
          //  .replace('@', '%40')
          //  .replace('=', '%3D')
    ;}

export function svgToDataURI(svgStr: string): string {
    return 'data:image/svg+xml,' + encodeSvg(svgStr)
}

// Font Awesome 
export const ICON_SVG_MUSIC = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7l0 72 0 264c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L448 147 192 223.8 192 432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L128 200l0-72c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/></svg>'
export const ICON_SVG_CHEVRON_RIGHT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>'