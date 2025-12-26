window.onload = function () {

    // 頁籤
    const tabList = document.querySelector(".productClassTabs");
    const contentInner = document.querySelector(".tab-content-inner");

    tabList.addEventListener("click", function (e) {
        if (e.target.classList.contains("productClass")) {
            const tabs = Array.from(tabList.querySelectorAll(".productClass"));
            const index = tabs.indexOf(e.target); // 確認是第幾個tab

            // 移除所有 tab 的 'in' class，加到被點的那個
            tabList.querySelectorAll(".productClass").forEach(t => t.classList.remove("in"));
            e.target.classList.add("in");

            // 計算要偏移的距離（動態寬度版本）
            const panelWidth = contentInner.querySelector(".tab-panel").offsetWidth;
            contentInner.style.marginLeft = `-${index * panelWidth}px`;
        }
    });

    //產品追溯碼 + 產品檢驗

    let trackList = document.querySelectorAll(".trackNum");
    let trackCon = document.querySelectorAll(".trackData");
    let closeBtn = document.querySelectorAll(".closeBtn");
    let certifications = document.querySelector("body");

    console.log(trackList)

    trackList.forEach(function (trackList, index) {
        trackList.addEventListener("click", function () {
            console.log("你點了第 " + (index) + " 個連結！");
            let alertWrapPos = document.querySelector(".alertWrapPos");
            alertWrapPos.style = "display:block"
            trackCon[index].classList.toggle("show")

            closeBtn[index].addEventListener("click", function () {
                alertWrapPos.style = "display:none"
                trackCon[index].classList.remove("show")
            })
        });
    });



    certifications.addEventListener("click", function (e) {

        //追朔碼浮動視窗超連結
        if (e.target.classList.contains("IPQC")) {

            let alertWrapPos = document.querySelector(".alertWrapPos");
            let reports = document.querySelector("#reports");
            let closeBtn = document.querySelector("#reports .closeBtn");

            alertWrapPos.style = "display:block"
            reports.classList.toggle("show")

            closeBtn.addEventListener("click", function () {
                alertWrapPos.style = "display:none"
                reports.classList.remove("show")
            })

        }
//        產品履歷碼插入統一超連結
        if (e.target.classList.contains("pn")) {

            e.target.setAttribute("href", "http://trace.kaoching.com.tw/traceability/1131109015")
            e.target.setAttribute("target", "_blank")

        }


    });





}

