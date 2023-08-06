'use strict'

// geolocation
function successs(pos) {
    ajaxRequest(pos.coords.latitude, pos.coords.longitude);
}

function fail(pos) {
    alert('位置情報の取得に失敗しました．エラーコード：'+error.code);
}

navigator.geolocation.getCurrentPosition(successs, fail);

//UTCをミリ秒に
function utcToJSTime(utcTime){
    return utcTime * 1000;
}

// データ取得
function ajaxRequest(lat, long) {
    const url = 'https://api.openweathermap.org/data/2.5/forecast';
    const appId = 'ここにAPIキーを入れる' // ここはAPIキーを入れる．github上では見て欲しくないから消す．

    $.ajax({
        url: url,
        data: {
            appid: appId,
            lat: lat,
            lon: long,
            units: 'metric',
            lang: 'ja'
        }
    })
    .done(function(data){
        //console.log(data);

        // 都市名・国名
        //console.log('都市名'+data.city.name);
        //console.log('国名'+data.city.country);
        $('#place').text(data.city.name+', '+data.city.country);

        //　天気予報データ
        data.list.forEach(function(forecast, index){
            const dateTime = new Date(utcToJSTime(forecast.dt));
            const month = dateTime.getMonth() + 1;
            const date = dateTime.getDate();
            const hour = dateTime.getHours();
            const min = String(dateTime.getMinutes()).padStart(2, '0');
            const temperature = Math.round(forecast.main.temp);
            const description = forecast.weather[0].description;
            const iconPath = `../7-02_api/step4/images/${forecast.weather[0].icon}.svg`;

            //console.log('日時: '+`${month}/${date} ${hour}/${min}`);
            //console.log('気温: '+temperature);
            //console.log('天気: '+description);
            //console.log('画像パス: '+iconPath);

            if(index === 0){
                const currentWeather = `
                <div class="icon"><img src="${iconPath}"></img></div>
                <div class="info">
                    <p>
                        <span class="description">現在の天気:${description}</span>
                        <span class="temp">現在の天気:${temperature}</span>℃
                    </p>
                </div>
                `;
                $('#weather').html(currentWeather);
            } else {
                const tableRow = `
                <tr>
                    <td class="info">
                        ${month}/${date} ${hour}/${min}
                    </td>
                    <td class="icon"><img src="${iconPath}"></td>
                    <td><span class="description">${description}</span></td>
                    <td><span class="temp">${temperature}℃</span></td>
                </tr>
                `;
                $('#forecast').append(tableRow);
            }
        });
    })
    .fail(function(){
        console.log('$.ajax failed!');
    })
}