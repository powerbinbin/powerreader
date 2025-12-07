(function(){
    // ======================
    // 创建悬浮控制台
    // ======================
    const panel=document.createElement("div");
    panel.id = "powerwater-panel";
    Object.assign(panel.style,{
        position:"fixed",
        top:"40px",
        right:"40px",
        width:"400px",
        fontSize:"14px",
        borderRadius:"16px",
        boxShadow:"0 12px 28px rgba(0,0,0,0.25)",
        zIndex:999999,
        userSelect:"none",
        background:"rgba(255,255,255,0.95)",
        backdropFilter:"blur(10px)",
        overflow:"hidden",
        fontFamily:"'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        display:"flex",
        flexDirection:"column"
    });

    // ======================
    // 控制区
    // ======================
    const controlArea=document.createElement("div");
    Object.assign(controlArea.style,{
        padding:"12px 14px",
        display:"flex",
        flexDirection:"column",
        gap:"10px"
    });

    // 文件加载
    const fileWrapper=document.createElement("div");
    fileWrapper.style.display="flex"; fileWrapper.style.alignItems="center"; fileWrapper.style.gap="6px";
    const fileBtn=document.createElement("button");
    fileBtn.textContent="选择文件";
    Object.assign(fileBtn.style,{
        padding:"8px 16px",
        borderRadius:"8px",
        border:"1px solid rgba(0,0,0,0.2)",
        cursor:"pointer",
        background:"linear-gradient(135deg,#fefefe,#e6f7ff)",
        transition:"0.2s all",
        fontSize:"14px"
    });
    fileBtn.onmouseover=()=>fileBtn.style.background="linear-gradient(135deg,#d0eaff,#a0d4ff)";
    fileBtn.onmouseout=()=>fileBtn.style.background="linear-gradient(135deg,#fefefe,#e6f7ff)";
    const hiddenInput=document.createElement("input");
    hiddenInput.type="file"; hiddenInput.accept=".txt"; hiddenInput.style.display="none";
    fileBtn.onclick=()=>hiddenInput.click();
    const fileNameDisplay=document.createElement("span");
    fileNameDisplay.style.fontStyle="italic";
    fileNameDisplay.style.fontSize="12px";
    fileNameDisplay.style.color="#555";
    fileWrapper.appendChild(fileBtn);
    fileWrapper.appendChild(fileNameDisplay);
    fileWrapper.appendChild(hiddenInput);
    controlArea.appendChild(fileWrapper);

    // 设置区
    const settingWrapper=document.createElement("div");
    settingWrapper.style.display="flex"; settingWrapper.style.flexWrap="wrap"; settingWrapper.style.gap="6px"; 
    // 次数
    const repeatLabel=document.createTextNode("次数："); 
    const repeatInput=document.createElement("input"); repeatInput.type="number"; repeatInput.value=3; repeatInput.min=1; repeatInput.style.width="50px"; repeatInput.style.borderRadius="6px"; repeatInput.style.border="1px solid rgba(0,0,0,0.2)";
    // 间隔
    const intervalLabel=document.createTextNode("间隔(s)："); 
    const intervalInput=document.createElement("input"); intervalInput.type="number"; intervalInput.value=1.5; intervalInput.min=0.5; intervalInput.step=0.5; intervalInput.style.width="60px"; intervalInput.style.borderRadius="6px"; intervalInput.style.border="1px solid rgba(0,0,0,0.2)";
    // 循环
    const loopLabel=document.createTextNode("循环："); 
    const loopCheckbox=document.createElement("input"); loopCheckbox.type="checkbox";
    // 语音
    const voiceWrapper=document.createElement("div"); voiceWrapper.style.display="flex"; voiceWrapper.style.alignItems="center"; voiceWrapper.style.gap="4px";
    const voiceLabel=document.createTextNode("语音：");
    const voiceSelect=document.createElement("select"); voiceSelect.style.width="80px";
    ["en-US","en-GB"].forEach(v=>{ const op=document.createElement("option"); op.value=v; op.textContent=v==="en-US"?"美音":"英音"; voiceSelect.appendChild(op); });
    voiceWrapper.appendChild(voiceLabel); voiceWrapper.appendChild(voiceSelect);

    // 行数显示
    const rowStatus=document.createElement("span");
    rowStatus.textContent="正在播放：第0行 / 共0行";
    rowStatus.style.marginLeft="10px";
    rowStatus.style.fontSize="12px";
    rowStatus.style.color="#333";
    rowStatus.style.flexGrow="1";

    [repeatLabel, repeatInput, intervalLabel, intervalInput, loopLabel, loopCheckbox, voiceWrapper, rowStatus].forEach(el=>settingWrapper.appendChild(el));
    controlArea.appendChild(settingWrapper);

    // 原来的按钮区
    const buttonWrapper=document.createElement("div");
    buttonWrapper.style.display="flex";
    buttonWrapper.style.justifyContent="space-between";
    buttonWrapper.style.marginTop="8px";
    buttonWrapper.style.gap="8px";

    const ABtn=document.createElement("button"); ABtn.textContent="开始";
    const BBtn=document.createElement("button"); BBtn.textContent="开始";
    const repeatBtn=document.createElement("button"); repeatBtn.textContent="复读";

    [ABtn,BBtn,repeatBtn].forEach(btn=>{
        btn.style.flex="1";
        btn.style.padding="12px 0";
        btn.style.fontSize="14px";
        btn.style.borderRadius="8px";
        btn.style.border="1px solid rgba(0,0,0,0.2)";
        btn.style.cursor="pointer";
        btn.style.background="linear-gradient(135deg,#fefefe,#e6f7ff)";
        btn.style.transition="0.2s all";
        btn.onmouseover=()=>btn.style.background="linear-gradient(135deg,#d0eaff,#a0d4ff)";
        btn.onmouseout=()=>btn.style.background="linear-gradient(135deg,#fefefe,#e6f7ff)";
    });
    buttonWrapper.appendChild(ABtn);
    buttonWrapper.appendChild(BBtn);
    buttonWrapper.appendChild(repeatBtn);
    controlArea.appendChild(buttonWrapper);

    // ======================
    // 新增按钮：上一行⬅️ 下一行➡️ 倍速⚡
    // ======================
    const navWrapper=document.createElement("div");
    navWrapper.style.display="flex";
    navWrapper.style.justifyContent="center";
    navWrapper.style.marginTop="8px";
    navWrapper.style.gap="12px";

    const prevBtn=document.createElement("button"); prevBtn.textContent="⬅️";
    const nextBtn=document.createElement("button"); nextBtn.textContent="➡️";
    const speedBtn=document.createElement("button"); speedBtn.textContent="⚡";

    [prevBtn,nextBtn,speedBtn].forEach(btn=>{
        btn.style.width="60px";
        btn.style.height="40px";
        btn.style.fontSize="20px";
        btn.style.borderRadius="8px";
        btn.style.border="1px solid rgba(0,0,0,0.2)";
        btn.style.cursor="pointer";
        btn.style.background="linear-gradient(135deg,#fefefe,#e6f7ff)";
        btn.style.transition="0.2s all";
        btn.onmouseover=()=>btn.style.background="linear-gradient(135deg,#d0eaff,#a0d4ff)";
        btn.onmouseout=()=>btn.style.background="linear-gradient(135deg,#fefefe,#e6f7ff)";
    });
    navWrapper.appendChild(prevBtn);
    navWrapper.appendChild(nextBtn);
    navWrapper.appendChild(speedBtn);
    controlArea.appendChild(navWrapper);

    panel.appendChild(controlArea);
    document.body.appendChild(panel);

    // ======================
    // 拖动逻辑（保持原样）
    // ======================
    let isDragging=false, offsetX=0, offsetY=0;
    panel.addEventListener('mousedown', e=>{
        if(["BUTTON","INPUT","SELECT"].includes(e.target.tagName)) return;
        isDragging=true; offsetX=e.clientX-panel.offsetLeft; offsetY=e.clientY-panel.offsetTop;
        panel.style.cursor="move"; e.preventDefault();
    });
    document.addEventListener('mousemove', e=>{
        if(!isDragging) return;
        panel.style.left=e.clientX-offsetX+'px';
        panel.style.top=e.clientY-offsetY+'px';
        panel.style.right='auto'; panel.style.bottom='auto';
    });
    document.addEventListener('mouseup', e=>{ if(isDragging){isDragging=false; panel.style.cursor="default";} });

    // ======================
    // 播放逻辑变量
    // ======================
    let words=[], wordIndex=0, repeatCount=0;
    let isPaused=false, isStopped=false, isRepeating=false;
    let speech=null;
    let speedRates=[0.75,1,1.25,1.5,2]; 
    let speedIndex=1; // 默认 1.0

    function updateProgress(){ 
        progressBar.max=words.length>0?words.length-1:0; 
        progressBar.value=wordIndex; 
        rowStatus.textContent=`正在播放：第${wordIndex+1}行 / 共${words.length}行`;
    }

    // ======================
    // 文件加载
    // ======================
    hiddenInput.onchange=()=>{
        const file=hiddenInput.files[0]; 
        if(!file) return;
        fileNameDisplay.textContent=file.name;
        const reader=new FileReader();
        reader.onload=e=>{
            words=e.target.result.split(/\r?\n/).map(v=>v.trim()).filter(v=>v);
            wordIndex=0; repeatCount=0; isPaused=false; isStopped=false; isRepeating=false;
            ABtn.textContent="开始"; BBtn.textContent="开始"; repeatBtn.textContent="复读";
            updateProgress();
        };
        reader.readAsText(file);
    };

    // ======================
    // 朗读函数
    // ======================
    function speakNext(){
        if(!words.length || isPaused || isStopped) return;
        const sentence=words[wordIndex];
        const maxRepeat=parseInt(repeatInput.value,10);
        if(speech) speechSynthesis.cancel();
        speech=new SpeechSynthesisUtterance(sentence);
        speech.lang=voiceSelect.value;
        speech.rate = speedRates[speedIndex];
        speech.onend=()=>{
            if(isPaused || isStopped) return;
            repeatCount++;
            const interval=(parseFloat(intervalInput.value)*1000)||1500;
            if(isRepeating){ setTimeout(speakNext, interval); return; }
            if(repeatCount<maxRepeat){ setTimeout(speakNext, interval); }
            else{
                repeatCount=0; wordIndex++;
                if(wordIndex>=words.length){ if(loopCheckbox.checked) wordIndex=0; else return; }
                setTimeout(speakNext, interval);
            }
            updateProgress();
        };
        speechSynthesis.speak(speech);
        updateProgress();
    }

    // ======================
    // 原有按钮逻辑（保持原样）
    // ======================
    ABtn.onclick=()=>{ if(ABtn.textContent==="开始"||ABtn.textContent==="继续"){ isStopped=false; isPaused=false; ABtn.textContent="暂停"; BBtn.textContent="停止"; repeatBtn.textContent="复读"; setTimeout(()=>speakNext(),0); } else if(ABtn.textContent==="暂停"){ isPaused=true; ABtn.textContent="继续"; BBtn.textContent="开始"; speechSynthesis.pause(); } };
    BBtn.onclick=()=>{ if(BBtn.textContent==="开始"){ isStopped=false; isPaused=false; wordIndex=0; repeatCount=0; ABtn.textContent="暂停"; BBtn.textContent="停止"; repeatBtn.textContent="复读"; setTimeout(()=>speakNext(),0); } else if(BBtn.textContent==="停止"){ isStopped=true; isPaused=false; speechSynthesis.cancel(); ABtn.textContent="继续"; BBtn.textContent="开始"; } };
    repeatBtn.onclick=()=>{ if(!words.length || isPaused || isStopped) return; isRepeating=!isRepeating; repeatBtn.textContent=isRepeating?"取消复读":"复读"; if(isRepeating){ repeatCount=0; speechSynthesis.cancel(); setTimeout(()=>speakNext(),0); } };
    const progressBar=document.createElement("input"); progressBar.type="range"; progressBar.min=0; progressBar.value=0; progressBar.step=1;
    Object.assign(progressBar.style,{ width:"calc(100% - 28px)", margin:"0 14px 10px 14px", accentColor:"#1e90ff", cursor:"pointer" });
    panel.appendChild(progressBar);
    progressBar.addEventListener("input", ()=>{ if(!words.length) return; wordIndex=parseInt(progressBar.value,10); repeatCount=0; if(!isPaused && !isStopped){ speechSynthesis.cancel(); setTimeout(()=>speakNext(),0); } });

    // ======================
    // 新按钮逻辑
    // ======================
    prevBtn.onclick=()=>{
        if(!words.length) return;
        wordIndex=Math.max(0, wordIndex-1);
        repeatCount=0; speechSynthesis.cancel(); setTimeout(()=>speakNext(),0);
    };
    nextBtn.onclick=()=>{
        if(!words.length) return;
        wordIndex=Math.min(words.length-1, wordIndex+1);
        repeatCount=0; speechSynthesis.cancel(); setTimeout(()=>speakNext(),0);
    };
    speedBtn.onclick=()=>{
        speedIndex = (speedIndex+1) % speedRates.length;
        speedBtn.textContent = `⚡${speedRates[speedIndex]}x`;
    };

})();

