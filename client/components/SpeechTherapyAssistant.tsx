import { useEffect } from "react";

// Minimal React component to inject the Chatbase embed script.
// The component keeps the same default export name so existing imports
// (in Client `ParentDashboard`) keep working.
export default function SpeechTherapyAssistant(): null {
  useEffect(() => {
    if (document.getElementById("chatbase-inline")) return;

    const inline = document.createElement("script");
    inline.type = "text/javascript";
    inline.id = "chatbase-inline";
    inline.innerHTML = `(function(){
  if(!window.chatbase||window.chatbase("getState")!=="initialized"){
    window.chatbase=(...arguments)=>{
      if(!window.chatbase.q){window.chatbase.q=[]}
      window.chatbase.q.push(arguments)
    };
    window.chatbase=new Proxy(window.chatbase,{
      get(target,prop){
        if(prop==="q"){return target.q}
        return(...args)=>target(prop,...args)
      }
    })
  }
  const onLoad=function(){
    const script=document.createElement("script");
    script.src="https://www.chatbase.co/embed.min.js";
    script.id="gEbQnZ9nZyS0OKlEC3gUG";
    script.domain="www.chatbase.co";
    document.body.appendChild(script)
  };
  if(document.readyState==="complete"){onLoad()}
  else{window.addEventListener("load",onLoad)}
})();`;

    document.body.appendChild(inline);

    return () => {
      const el = document.getElementById("chatbase-inline");
      if (el) el.remove();
    };
  }, []);

  return null;
}
  if(document.readyState==="complete"){onLoad()}

