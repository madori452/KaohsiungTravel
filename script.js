// let data;
let data;
let jsonData;
let len;
// init
function init() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    'get',
    'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json',
    true
  );
  xhr.send();
  xhr.onload = function() {
    data = JSON.parse(xhr.responseText);
    jsonData = data.result.records;
    len = jsonData.length;
    let ary = [];
    DisplayData(ary);
    ZoneSelect();
    pagination(jsonData, 1);
  };
}
init();

const select = document.querySelector('#area');
const content = document.querySelector('.content_card');
const btn_all = document.querySelector('.btn_all');
const area_title = document.querySelector('.area_title');
const pageid = document.getElementById('pageid');
const ticket = document.querySelector('.card');
select.addEventListener('change', areaChange, false);
btn_all.addEventListener('click', areaChange, false);

//下拉選單區域
function ZoneSelect() {
  let areaList = [];
  let area = [];
  //將所有地名存到areaList
  for (let i = 0; i < len; i++) {
    areaList.push(jsonData[i].Zone);
  }
  //使用forEach與indexOf比對zone與areaList的值如果indexOf(value) ==-1
  //就代表沒有這個值就把他push到zone裡，就會得到一個沒有重複的地名
  areaList.forEach(function(e) {
    if (area.indexOf(e) == -1) {
      area.push(e);
    }
  });
  let option = '<option value="尚未選擇選擇區" selected>-請選擇-</option>';
  for (let i = 0; i < area.length; i++) {
    option += `<option value="${area[i]}">${area[i]}</option>`;
  }
  select.innerHTML = option;
}
//顯示資料
function areaChange(e) {
  const nowArea = e.target.value;
  area_title.textContent = nowArea;

  let selectAry = [];

  for (let i = 0; i < len; i++) {
    if (nowArea === jsonData[i].Zone) {
      selectAry.push(jsonData[i]);
    }
  }
  DisplayData(selectAry);
  pagination(selectAry, 1);
}

//分頁製作
function pagination(jsonData, nowPage) {
  const dataTotal = jsonData.length;
  const perpage = 6;
  const pageTotal = Math.ceil(dataTotal / perpage);
  console.log(dataTotal, pageTotal);
  let currentPage = nowPage;
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }
  const min = currentPage * perpage - perpage + 1;
  const max = currentPage * perpage;
  const ary = [];
  jsonData.forEach((item, index) => {
    // 獲取陣列索引，但因為索引是從 0 開始所以要 +1。
    const num = index + 1;
    // 當 num 比 minData 大且又小於 maxData 就push進去新陣列。
    if (num >= min && num <= max) {
      ary.push(item);
    }

    const page = {
      pageTotal,
      currentPage,
      hasPage: currentPage > 1,
      hasNext: currentPage < pageTotal,
    };
    DisplayData(ary);
    pageBtn(page);
  });
}

// DisplayData
function DisplayData(ary) {
  let str = '';

  ary.forEach(item => {
    let condition = item.Ticketinfo == '' ? 'none' : 'display';

    str += `<div class="card">
        <div class="card_banner">
          <img src="${item.Picture1}" class="card_banner_pic">
          <p class="locate"> ${item.Name}</p>
        </div>
        <div class="info">
          <p class="time"><img src="https://upload.cc/i1/2021/07/06/si8rdx.png"> ${item.Opentime}</p>
          <p class="address"> <img src="https://upload.cc/i1/2021/07/06/4I6jMr.png"> ${item.Add}</p>
          <p class="phone"> <img src="https://upload.cc/i1/2021/07/06/oDnVAp.png"> ${item.Tel}</p>
          <p class="ticket" > <img class='${condition}' src="https://upload.cc/i1/2021/07/06/tVbMsx.png"> ${item.Ticketinfo}</p>
        </div>
      </div>`;
  });
  content.innerHTML = str;
}

//分頁按鈕
function pageBtn(page) {
  let str = '';
  const total = page.pageTotal;

  if (page.hasPage) {
    str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(
      page.currentPage
    ) - 1}">Previous</a></li>`;
  } else {
    str += `<li class="page-item disabled"><span class="page-link">Previous</span></li>`;
  }

  for (let i = 1; i <= total; i++) {
    if (Number(page.currentPage) === i) {
      str += `<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    } else {
      str += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }
  }

  if (page.hasNext) {
    str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(
      page.currentPage
    ) + 1}">Next</a></li>`;
  } else {
    str += `<li class="page-item disabled"><span class="page-link">Next</span></li>`;
  }

  pageid.innerHTML = str;
}

//分頁點擊判斷
function switchPage(e) {
  if (e.target.nodeName !== 'A') return;
  const page = e.target.dataset.page;
  pagination(jsonData, page);
}

pageid.addEventListener('click', switchPage);
