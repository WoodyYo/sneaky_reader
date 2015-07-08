TODO: 
1. 記憶功能(停留位置、上一本書是啥)
2. save2cookie_timer要檢查有無變化，有變化再傳msg
3. 收到save2cookie => 對相同名稱之頁面做相同動作(scroll)
4. 字型大小、scheme...
5. 想一想其實只需要把last_read存到sand box就夠了= =
6. 允許手動關掉相同名稱的sync
7. 載入前的說明圖片，預計使用dataURL?
8. BG監控每個tab，確保不會因為換個頁面就跳到last_read，因此第5點必須修正(總不能存個5本書在記憶體吧= =)

NOTE:
跟臉書似乎會出問題，就寫進exclude_match裡面了，反正能都上臉書應該就不需要偷看小說了XDD 

THOUGHTS:
在BG寫一個init函數把last_read, pos, __name, __content, tab id, sync box這些複雜的邏輯都包起來一口氣回傳