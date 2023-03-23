# Dcard Project Manager
## 啟動專案
### 網頁連結
+ [Website Deployment Link](https://dcard-intern.github.io/)

### 使用GitHub帳號登入
![Screenshot from 2023-03-24 00-13-50](https://user-images.githubusercontent.com/103064446/227266715-2594f9fa-b870-4703-b5ab-421d687dfd6d.png)

### 選擇GitHub專案
+ 登入完成後，請輸入想要操作的repo擁有者與名稱。
+ 以這個專案的repo為例，就是`dcard-intern/dcard-intern.github.io`

![](https://i.imgur.com/ar994Mz.png)

+ 如果輸入的repo擁有者與名稱確實存在，就會導引到主頁，顯示該repo的issue(以下皆稱為task)。<br/>
:star2: **Feature:** 一進到這個頁面，使用者不需要點一下輸入方塊也可以直接輸入！<br/>
:star2: **Feature:** 使用者輸入完畢後，按下鍵盤的`Enter`也可以送出。<br/>
:ok_hand: **Error Handling:** 如果使用者未輸入任何字元就送出，會提醒使用者須輸入字元再送出。如果使用者輸入的repo不存在，也會提醒使用者修改輸入內容。

### 主頁
+ 如果使用者指定的repo有task，就會在主頁顯示。另外，主頁也會顯示使用者正在操作的repo。<br/>
:star2: **Feature:** 在API回傳task之前，會顯示`Loading...`告知使用者當前狀態。
![](https://i.imgur.com/yKjlVPv.jpg)
:star2: **Feature:** 根據作業規定，主頁一開始最多只會載入10個task，如果使用者往下滑到底就會再載入另外10個，直到沒有更多task為止。
![](https://i.imgur.com/kpIU03O.png)

+ 如果沒有任何task，就會顯示`No tasks!`。
![](https://i.imgur.com/WfM5Tl4.png)

### 依照Task建立時間排序
+ 按一下`Sort by time`旁邊的按鈕即可選擇要將task由新到舊`Descending`或由舊到新`Ascending`排序，預設為由新到舊。
![](https://i.imgur.com/lxOEx7k.jpg)

### 依照Task Label篩選
+ 按一下`Filters`旁邊的按鈕就可以選擇要依照什麼label篩選task，預設為`None`，表示顯示全部task。如果篩選結果沒有任何task，也會顯示`No tasks!`。
![](https://i.imgur.com/MW4O7HL.jpg)

### 新增Task
+ 按一下`New task`就可以新增task。
![](https://i.imgur.com/cuuBOBr.jpg)

+ 接著會看到這個彈出視窗，可以在這裡新增task，包含設定label，輸入title和body等等。<br/>
:star2: **Feature:** body支援Markdown語法，另外可以用Markdown格式輸入圖片連結，即可在body中新增圖片。
![](https://i.imgur.com/OyeX7S9.jpg)


+ 在彈出視窗中按一下label可以更換其他label。<br/>
:star2: **Feature:** 打開label選單後，再用滑鼠點一下螢幕任何位置就能關閉選單。
![](https://i.imgur.com/QQQMgZZ.jpg)


+ 輸入完成後按一下`Submit`就可以送出新的task，而按一下`Cancel`可以關閉彈出視窗。<br/>
:ok_hand: **Error Handling:** 如果使用者沒有輸入title或是body字數少於30字就送出，就會提醒使用者輸入格式限制。

### 在Task中搜尋
+ 在這裡輸入要搜尋的文字後，按下`Apply`就可以搜尋對應的task，而按一下`Clear`可以清空搜尋欄並顯示所有task。<br/>
:ok_hand: **Error Handling:** 如果使用者沒有輸入任何字元就按下`Apply`，會提醒使用者沒有輸入字元。
![](https://i.imgur.com/ErVVbjG.jpg)



### Task內容
+ 每一個task都有專屬的區塊，包含label、number、title和body，以及設定的icon。<br/>
:star2: **Feature:** 如同前面提到的task body支援Markdown語法，也可以處理圖片。為了避免圖片過大破壞版面，一律將圖片寬度設為700像素。<br/>
:star2: **Feature:** Task會根據label改變配色，`In Progress`是紅色系，`Done`是綠色系，而`Open`和其他label都是灰色系，讓使用者一眼辨識task的狀態。
![](https://i.imgur.com/tiSAN8a.jpg)

+ 按一下label可以在選單中選擇其他label。<br/>
:star2: **Feature:** 在網頁任意位置點一下，就可以關閉label選單。
![](https://i.imgur.com/QWg4D57.jpg)

+ 按一下右側的設定按鈕，可以選擇編輯或刪除Task。<br/>
:star2: **Feature:** 在網頁任意位置點一下，就可以關閉設定選單。
![](https://i.imgur.com/ef0WIMw.jpg)


+ 按一下`Edit`後，就會看到編輯Task的彈出視窗，和新增Task很像。<br/>
:star2: **Feature:** 編輯task時，會自動顯示原本的label、title和body，讓使用者更方便修改內容。<br/>
:star2: **Feature:** 按下`Submit`後，title和body都會顯示`Loading...`，等到GitHub更新完成就會顯示新的task。
![](https://i.imgur.com/0ewAyAh.jpg)

+ 按一下`Delete`後，就會刪除這個task，並在GitHub上設為`closed`。

### 重新選擇Repo
+ 如果想要更換repo，可以按主頁左上角的返回箭頭，即可重新選取repo。
![](https://i.imgur.com/cv4xAcu.jpg)


## 專案架構設計
### React.js Component
+ 本專案將每一個頁面或是重複使用的元件包裝成component，包含登入頁面`Login`、設定GitHub repo頁面`SetRepo`、主頁`Home`、每一個task`ListElement`以及新增或編輯task的`IssueTable`。
+ `Login`、`SetRepo`、`Home`這三個渲染頁面的component皆由`App.js`統一管理，而`Home`會將每一個要顯示的task交給`ListElement`渲染，另外`Home`和`ListElement`都會將新增或編輯task的任務交給`IssueTable`負責渲染彈出視窗，並將輸入完畢的task交給`Home`新增或編輯GitHub上的task。

### Login Page
+ 由於這個專案要設計給強尼的工作團隊，我選擇一張在咖啡廳使用電腦的背景，同時搭配一個獨特的登入按鈕，當使用者按下之後就會看到七彩流動的背景，是這個專案的小巧思。
+ 按下登入按鈕後，網頁就會顯示`Loading...`並發出GitHub OAuth reqeust，取得回傳的授權碼。接著網頁需要拿授權碼向GitHub交換authorization token，但是根據[這則Issue](https://github.com/isaacs/github/issues/330)，GitHub基於安全考量不允許client-side application取得authorization token，因此我在之前架設[交大電機考古網站](https://prevexam.dece.nycu.edu.tw/)的伺服器上新增一個API，協助這個專案取得使用者的token。
+ 取得authorization token後，網頁就會導向`SetRepo`頁面。

### SetRepo Page
+ 在這裡，網頁會顯示使用者的GitHub名稱，歡迎使用Dcard專案管理員！

### Home Page
+ 負責發出所有和task相關的API request，包含取得、編輯(包含刪除)、建立Task等等。如果發出API Request後收到error，就會顯示`Error!`。
+ 記錄當前所有要顯示的task，將每一個task分配給`ListElement`渲染後顯示在瀏覽器中，另外也記錄使用者設定的篩選條件、排序邏輯以及搜尋task的關鍵字。
+ 追蹤使用者滑鼠滾動的位置，如果向下滑到底的時候就會發出API request取得更多task，直到沒有其他task為止。
+ 取得task的方式是指定每頁數量`perPage`和頁數`page`兩個參數後發出API request，接著將檢查回傳的task是否已經存在於網頁中，如果尚未出現就整合進現有的task。如果整合完畢後發現新的task少於10個，就會持續發出request，直到滿足10個新task或是沒有更多task。這樣做的原因是為了避免使用者刪除task後，可能會在下次取得task時遺漏次頁的第一個task，因為它會被GitHub視為前一頁的最後一個task而無法在次頁取得。

### ListElement
+ 負責渲染每一個task，使用ReactMarkdown渲染body的Markdown語法。
+ 檢查body中是否有圖片，如果有圖片就使用正規表達式擷取圖片連結，轉換為HTML標籤，搭配rehypeRaw套件渲染在body中，並統一設定寬度為700像素。
+ 如果使用者打開label選單或是設定，在瀏覽器中按一下滑鼠就會關閉選單，不需要再按一下label或是設定按鈕。

### IssueTable
+ 負責編輯或新增task的彈出視窗，當使用者按下`Submit`後就會檢查title是否為空字串、body長度是否超過30字，若沒有達到標準就會提醒使用者繼續編輯。
+ 如果使用者打開label選單，在瀏覽器中按一下滑鼠一樣會關閉。

### CSS Modules
+ 這份專案的component皆使用CSS Modules渲染，相似的元件採用compose繼承的方式編寫CSS程式碼，提升重用性。

### Fetch API
+ 這份專案皆使用JavaScript Fetch API發送request，而非現成的GitHub API Client。

### Deployment
+ 這份專案部署在GitHub Pages靜態網頁伺服器上，根據[gh-pages](https://github.com/dcard-intern/dcard-intern.github.io/tree/gh-pages)這個branch部署。

### Cross-device (PC and Tablet) Application
+ 這份專案除了設計給電腦使用外，也特別為平板電腦量身打造，讓使用者外出時只需攜帶輕便的平板就可以管理所有task。
