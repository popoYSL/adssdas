function deleteChild() { 
    var e = document.querySelector("#document"); 
    var child = e.lastElementChild;  
    while (child) { 
        try{
            e.removeChild(child); 
            child = e.lastElementChild; 
        }
        catch(err) {

            }
        } 
    } 
    // var btn = document.getElementById("btn").onclick = function() { 
    //     deleteChild(); 
    // } 
    let targetNode = document.querySelector('#document')
    let config = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    }

    const mutationCallback = mutationList => {
    for (let mutation of mutationList) {
        let type = mutation.type
        switch (type) {
        case 'childList':
            console.log('节点被删除或添加')
            console.log(mutation)
            var $jsontip = $("#document");
            $jsontip.empty();//清空内容 
            break
        case 'attributes':
            console.log(`${mutation.attributeName}属性修改了`)
            break
        case 'subtree':
            console.log('子树被修改')
            break
        default:
            break
        }
    }
    }

    // 创建 MutationObserver 实例
    let observer = new MutationObserver(mutationCallback)

    // 开始监控目标节点
    observer.observe(document.body, config)