export const timeAgo = ( inputDate ) => {

    const date = ( inputDate instanceof Date) ? inputDate : new Date(inputDate);
  
    const FORMATTER = new Intl.RelativeTimeFormat('en');
    const RANGES = {
      years   : 3600 * 24 * 365,
      months  : 3600 * 24 * 30,
      weeks   : 3600 * 24 * 7,
      days    : 3600 * 24,
      hours   : 3600,
      minutes : 60,
      seconds : 1
    };
    
    const secondsElapsed = (date.getTime() - Date.now()) / 1000;
    
    for (let key in RANGES) {
      if ( RANGES[key] < Math.abs(secondsElapsed) ) {
        const delta = secondsElapsed / RANGES[key];
        return FORMATTER.format(Math.round(delta), key);
      }
    }
    
  }


  