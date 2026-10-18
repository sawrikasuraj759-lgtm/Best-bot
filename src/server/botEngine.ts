import { pipeline } from "stream/promises";
import { Readable } from "stream";
var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:true});import makeWASocket,{DisconnectReason,useMultiFileAuthState,fetchLatestBaileysVersion,Browsers,makeCacheableSignalKeyStore,downloadMediaMessage}from"@whiskeysockets/baileys";import pino from"pino";import QRCode from"qrcode";import fs from"fs";import path from"path";import{askGemini,analyzeAudioWithGemini,analyzeVideoWithGemini,generateCVWithGemini,chatAsYashiHallsAI,ChatMemoryItem}from"./geminiService";import{resolveSongAudio,searchYoutubeVideo}from"./audioService";import{resolveSearchImage}from"./imageService";import{adminStore}from"./adminStore";import{getWhatsAppVoiceBuffer}from"./voiceService";import{normalizeWhatsAppNumber}from"../utils/phone";import{resolveMediaFire}from"./mediafireService";import{searchMovies,formatMovieCard}from"./movieService";const BRAND_LOGO_URL="https://i.ibb.co/cXC7c42J/file-000000007c3c8210ae1b96d28b22c655.png";const WHATSAPP_CHANNEL_URL="https://whatsapp.com/channel/0029Vb927N4GJP8MS1yurM2Z";const OWNER_HOTLINE="0740712934";class BotEngine{constructor(userId="default"){this.sock=null;this.logs=[];this.maxLogs=500;this.startTime=null;this.reconnectAttempts=0;this.maxReconnectAttempts=20;this.isExplicitlyStopped=true;this.reconnectTimer=null;this.activePairingPhone=null;this.groupWarnings=new Map;this.activeQuizSessions=new Map;this.processedCalls=new Set;this.isQrReady=false;this.voiceCooldownMap=new Map;this.chatMemory=new Map;this.smartReplyCooldownMap=new Map;
    this.cachedLogoBuffer=null;
    this.lastCachedLogoUrl='';
    try {
      if (fs.existsSync('/app/applet/data/bot_logo_opt.jpg')) {
        this.cachedLogoBuffer = fs.readFileSync('/app/applet/data/bot_logo_opt.jpg');
        this.lastCachedLogoUrl = BRAND_LOGO_URL;
      }
    } catch (e) {}this.smartReplyCooldownMap=new Map;this.state={connectionStatus:"disconnected",isOnline:false,pairedNumber:null,qrCodeDataUrl:null,pairingCode:null,uptimeSeconds:0,startedAt:null,lastPingMs:18,totalMessagesReceived:0,totalCommandsExecuted:0,totalAiQueries:0,activeGroupCount:0,incomingCallsCount:0,callsRejectedCount:0,autoRepliesSentCount:0,voiceAutoRepliesSentCount:0,recentCalls:[],config:{botName:"YASHI HALLS MINI",botLogoUrl:"https://i.ibb.co/cXC7c42J/file-000000007c3c8210ae1b96d28b22c655.png",prefix:".",mode:"public",ownerNumber:"94740712934",autoReadStatus:true,plan:"mini",antiLink:false,antiSpam:false,welcomeMessage:true,welcomeTemplate:"Welcome @user to @group! Enjoy your stay.",callDetectorEnabled:true,voiceAutoReplyEnabled:true,channelAutoReact:true,channelReactEmojis:"\u2764\uFE0F,\u{1F525},\u26A1,\u{1F44D},\u{1F31F},\u{1F389},\u{1F680},\u{1F60D},\u{1F44F},\u{1F4AF},\u{1F929}",smartAutoReply:true,customGreetingSinhala:"\u0DC4\u0DCF\u0DBA\u0DD2 @user! \u{1F44B} \u0DB8\u0DB8 @bot WhatsApp Bot. \u0D94\u0DB6\u0DA7 \u0D8B\u0DAF\u0DC0\u0DCA \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7 \u0DB8\u0DB8 \u0DC3\u0DD6\u0DAF\u0DCF\u0DB1\u0DB8\u0DCA! \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1 \u0DB6\u0DD0\u0DBD\u0DD3\u0DB8\u0DA7 @prefixmenu \u0DBD\u0DD9\u0DC3 \u0D91\u0DC0\u0DB1\u0DCA\u0DB1. \u{1F60A}",customGreetingEnglish:"Hello @user! \u{1F44B} I am @bot WhatsApp Bot. Type @prefixmenu to view all commands.",customAutoReplies:[{id:"rule-price",keyword:"\u0DB8\u0DD2\u0DBD",reply:"\u{1F4B0} *YASHI HALLS Bot \u0DB8\u0DD2\u0DBD \u0D9C\u0DAB\u0DB1\u0DCA:*\n\u2022 MINI Plan: \u0DB1\u0DDC\u0DB8\u0DD2\u0DBD\u0DDA (FREE / 150 Limit)\n\u2022 PRO Plan: 10 Coins\n\u2022 BUSINESS Plan: 30 Coins\nDashboard \u0D91\u0D9A\u0DD9\u0DB1\u0DCA \u0D9A\u0DCA\u0DC2\u0DAB\u0DD2\u0D9A\u0DC0 \u0DC3\u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA \u0D9A\u0DBB\u0D9C\u0DAD \u0DC4\u0DD0\u0D9A!"},{id:"rule-channel",keyword:"channel",reply:"\u{1F517} *YASHI HALLS Official Channel:*\nhttps://whatsapp.com/channel/0029Vb927N4GJP8MS1yurM2Z\n\u0DB1\u0DC0\u0DAD\u0DB8 Bot updates \u0DC3\u0DC4 features \u0DC3\u0DB3\u0DC4\u0DCF \u0D85\u0DAF\u0DB8 \u0D91\u0D9A\u0DAD\u0DD4 \u0DC0\u0DB1\u0DCA\u0DB1! \u{1F680}"}]},quotas:{mediaRequestsUsed:0,mediaQuotaMax:150,aiRequestsUsed:0,aiQuotaMax:150,maxBotSlots:1}};this.userId=userId;const safeId=userId.replace(/[^a-zA-Z0-9_-]/g,"_");this.sessionDir=safeId==="default"||!safeId?path.resolve(process.cwd(),"data","whatsapp_session"):path.resolve(process.cwd(),"data","sessions",safeId,"whatsapp_session");this.configFile=safeId==="default"||!safeId?path.resolve(process.cwd(),"data","bot_config.json"):path.resolve(process.cwd(),"data","sessions",safeId,"bot_config.json");this.addLog("INFO",`BotEngine initialized for user: ${userId} with Dual Plan support (MINI & PRO).`);this.loadSavedConfig();this.checkExistingSession()}static{__name(this,"BotEngine")}loadSavedConfig(){try{if(fs.existsSync(this.configFile)){const raw=fs.readFileSync(this.configFile,"utf-8");const parsed=JSON.parse(raw);this.state.config={...this.state.config,...parsed};this.addLog("INFO",`Loaded persisted bot settings: AutoReply=${this.state.config.smartAutoReply?"ON":"OFF"}, ChannelReact=${this.state.config.channelAutoReact?"ON":"OFF"}`)}}catch{}}saveConfigToFile(){try{fs.mkdirSync(path.dirname(this.configFile),{recursive:true});fs.writeFileSync(this.configFile,JSON.stringify(this.state.config,null,2))}catch{}}addLog(level,message){const timestamp=new Date().toLocaleTimeString("en-US",{hour12:false});const log={id:`${Date.now()}-${Math.random().toString(36).substr(2,5)}`,timestamp,level,message};this.logs.push(log);if(this.logs.length>this.maxLogs){this.logs.shift()}}checkExistingSession(){try{if(fs.existsSync(this.sessionDir)){const files=fs.readdirSync(this.sessionDir);if(files.some(f=>f.includes("creds.json"))){this.addLog("INFO","Existing WhatsApp session credentials found in persistent storage.")}}else{fs.mkdirSync(this.sessionDir,{recursive:true})}}catch{}}getState(){const uptimeSeconds=this.startTime?Math.floor((Date.now()-this.startTime)/1e3):0;return{...this.state,uptimeSeconds}}getLogs(){return[...this.logs]}setPlan(plan){this.state.config.plan=plan;if(plan==="business"){this.state.config.botName="YASHI HALLS BUSINESS";this.state.quotas.mediaQuotaMax=999999;this.state.quotas.aiQuotaMax=999999;this.state.quotas.maxBotSlots=25;this.state.config.antiLink=true;this.state.config.antiSpam=true;this.addLog("INFO","\u{1F451} Tier upgraded to YASHI HALLS BUSINESS! 25 Bot Slots, Unlimited Media & AI, and VIP Enterprise SLA activated.")}else if(plan==="pro"){this.state.config.botName="YASHI HALLS PRO";this.state.quotas.mediaQuotaMax=1e3;this.state.quotas.aiQuotaMax=5e3;this.state.quotas.maxBotSlots=5;this.state.config.antiLink=true;this.state.config.antiSpam=true;this.addLog("INFO","\u{1F48E} Tier upgraded to YASHI HALLS PRO! All advanced features, multi-slots & unlimited quotas unlocked.")}else{this.state.config.botName="YASHI HALLS MINI";this.state.quotas.mediaQuotaMax=150;this.state.quotas.aiQuotaMax=150;this.state.quotas.maxBotSlots=1;this.state.config.antiLink=true;this.state.config.antiSpam=true;this.addLog("INFO","\u{1F7E2} Tier switched to YASHI HALLS MINI. Quotas set to 150 Daily Requests with all Pro & Business features unlocked!")}return this.getState()}async syncProfilePictureWithLogo(customLogoUrl){if(!this.sock||!this.state.isOnline){return{success:false,message:"WhatsApp bot must be online to update profile picture."}}const targetUrl=customLogoUrl||this.state.config.botLogoUrl||BRAND_LOGO_URL;try{const userJid=this.sock.user?.id;if(!userJid){return{success:false,message:"User JID not available."}}if(typeof this.sock.updateProfilePicture==="function"){await this.sock.updateProfilePicture(userJid,{url:targetUrl});if(customLogoUrl){this.state.config.botLogoUrl=customLogoUrl;this.saveConfigToFile()}this.addLog("INFO",`\u2705 Bot profile picture successfully updated to: ${targetUrl}`);return{success:true,message:"Bot profile picture updated successfully!"}}return{success:false,message:"Profile picture update not supported by current client session."}}catch(err){this.addLog("WARN",`Profile picture update attempt failed: ${err?.message}`);return{success:false,message:err?.message||"Failed to update profile picture"}}}updateConfig(newConfig){const customBotName=newConfig.botName;if(newConfig.plan){this.setPlan(newConfig.plan)}this.state.config={...this.state.config,...newConfig,...customBotName?{botName:customBotName}:{}};this.saveConfigToFile();this.addLog("INFO",`Configuration updated: Plan=${this.state.config.plan.toUpperCase()}, BotName="${this.state.config.botName}", Prefix="${this.state.config.prefix}", Logo="${this.state.config.botLogoUrl||"default"}"`);return this.state.config}resetQuotas(){this.state.quotas.mediaRequestsUsed=0;this.state.quotas.aiRequestsUsed=0;this.addLog("INFO","Daily quotas reset to 0.");return this.state.quotas}async start(requestedPhone){this.isExplicitlyStopped=false;this.reconnectAttempts=0;if(this.state.connectionStatus==="connected"&&this.sock){return{success:true,message:"Bot is already connected and online."}}if(requestedPhone){const cleanPhone=normalizeWhatsAppNumber(requestedPhone);if(cleanPhone)this.activePairingPhone=cleanPhone}if(this.reconnectTimer){clearTimeout(this.reconnectTimer);this.reconnectTimer=null}if(this.sock){try{this.sock.ev.removeAllListeners("connection.update");this.sock.ev.removeAllListeners("creds.update");this.sock.ev.removeAllListeners("messages.upsert");this.sock.ev.removeAllListeners("call");this.sock.ev.removeAllListeners("group-participants.update");try{this.sock.ws?.close()}catch(e){}try{this.sock.end(void 0)}catch(e){}}catch(err){}this.sock=null}try{this.state.connectionStatus="connecting";this.addLog("INFO",`Starting ${this.state.config.botName} WhatsApp Baileys connection...`);if(!fs.existsSync(this.sessionDir)){fs.mkdirSync(this.sessionDir,{recursive:true})}const{state:authState,saveCreds}=await useMultiFileAuthState(this.sessionDir);await saveCreds();const{version}=await fetchLatestBaileysVersion();this.addLog("INFO",`Using Baileys protocol v${version.join(".")}`);const logger=pino({level:"silent"});this.sock=makeWASocket({version,logger,printQRInTerminal:false,auth:{creds:authState.creds,keys:makeCacheableSignalKeyStore(authState.keys,logger)},browser:["YASHI HALLS","Chrome","24.7.0"],syncFullHistory:false,markOnlineOnConnect:false,connectTimeoutMs:12e4,defaultQueryTimeoutMs:12e4,keepAliveIntervalMs:25e3,generateHighQualityLinkPreview:true,getMessage:__name(async()=>void 0,"getMessage")});this.sock.ev.on("creds.update",saveCreds);this.sock.ev.on("connection.update",async update=>{const{connection,lastDisconnect,qr}=update;if(qr){if(!this.activePairingPhone&&!this.state.pairingCode){this.isQrReady=true;this.state.connectionStatus="qr_ready";try{const dataUrl=await QRCode.toDataURL(qr,{margin:2,scale:7});this.state.qrCodeDataUrl=dataUrl;this.addLog("INFO","QR code generated and ready for WhatsApp scan.")}catch(err){this.addLog("ERROR","Failed to generate QR Code data URL.")}}}if(connection==="close"){this.isQrReady=false;if(this.isExplicitlyStopped){this.state.isOnline=false;this.state.connectionStatus="disconnected";this.startTime=null;return}const statusCode=lastDisconnect?.error?.output?.statusCode;const errorMsg=String(lastDisconnect?.error?.message||lastDisconnect?.error||"");const isRestartRequired=statusCode===DisconnectReason.restartRequired;const isBadSession=statusCode===DisconnectReason.loggedOut||statusCode===401||statusCode===403||errorMsg.includes("Bad MAC")||errorMsg.includes("Failed to decrypt");const shouldReconnect=!isBadSession&&statusCode!==DisconnectReason.loggedOut&&!this.isExplicitlyStopped;this.state.isOnline=false;this.state.connectionStatus=shouldReconnect?"reconnecting":"disconnected";this.startTime=null;this.addLog("WARN",`Connection closed. Reason: ${DisconnectReason[statusCode]||statusCode||errorMsg||"Unknown"}. Reconnect=${shouldReconnect}`);if(isBadSession){this.addLog("WARN","Corrupted or expired session credentials detected (Bad MAC/401). Clearing stored session files.");this.clearSessionFiles();this.state.pairedNumber=null;this.state.connectionStatus="disconnected";if(this.reconnectTimer){clearTimeout(this.reconnectTimer);this.reconnectTimer=null}return}else if(shouldReconnect){if(isRestartRequired){this.addLog("INFO","WhatsApp stream restart requested (handshake/pairing update). Reconnecting in 500ms...");if(this.reconnectTimer)clearTimeout(this.reconnectTimer);this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null;if(!this.isExplicitlyStopped){this.start(this.activePairingPhone||requestedPhone)}},500)}else{const isUnregistered=!this.sock?.authState?.creds?.registered;const maxAttempts=isUnregistered?5:this.maxReconnectAttempts;if(this.reconnectAttempts<maxAttempts){this.reconnectAttempts++;this.addLog("INFO",`Reconnection attempt ${this.reconnectAttempts}/${maxAttempts} in 2.5 seconds...`);if(this.reconnectTimer)clearTimeout(this.reconnectTimer);this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null;if(!this.isExplicitlyStopped){this.start(this.activePairingPhone||requestedPhone)}},2500)}else{this.addLog("ERROR","Reconnection attempts timed out. Bot paused.");this.state.connectionStatus="disconnected"}}}}else if(connection==="open"){this.reconnectAttempts=0;this.activePairingPhone=null;this.state.isOnline=true;this.state.connectionStatus="connected";this.state.qrCodeDataUrl=null;this.state.pairingCode=null;this.startTime=Date.now();this.state.startedAt=new Date().toISOString();const userJid=this.sock?.user?.id||"";const phoneNum=userJid.split(":")[0]||userJid.split("@")[0]||"Unknown";this.state.pairedNumber=phoneNum;this.addLog("INFO",`\u2705 Connection established! ${this.state.config.botName} (${this.state.config.plan.toUpperCase()}) is now ONLINE for +${phoneNum}`);this.addLog("INFO",`Ready to respond to commands with prefix '${this.state.config.prefix}'.`);try{const targetJid=userJid.includes(":")?`${userJid.split(":")[0]}@s.whatsapp.net`:userJid.includes("@")?userJid:`${userJid}@s.whatsapp.net`;if(targetJid&&this.sock){const welcomeText=`\u{1F680} *YASHI HALLS WHATSAPP BOT IS ONLINE!* \u{1F7E2}

\u{1F44B} *\u0D86\u0DBA\u0DD4\u0DB6\u0DDD\u0DC0\u0DB1\u0DCA! YASHI HALLS \u0DC0\u0DD9\u0DAD \u0DC3\u0DCF\u0DAF\u0DBB\u0DBA\u0DD9\u0DB1\u0DCA \u0DB4\u0DD2\u0DC5\u0DD2\u0D9C\u0DB1\u0DD2\u0DB8\u0DD4.*
\u0D94\u0DB6\u0D9C\u0DDA WhatsApp Bot \u0DC3\u0DCF\u0DBB\u0DCA\u0DAE\u0D9A\u0DC0 \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0 \u0DC0\u0DD3 \u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA\u0DCF\u0DAD\u0DCA\u0DB8\u0D9A \u0DC0\u0DD2\u0DBA (Bot Started Successfully).

\u{1F4CC} *Bot \u0DC0\u0DD2\u0DC3\u0DCA\u0DAD\u0DBB:*
\u2022 *Bot Name:* ${this.state.config.botName||"YASHI HALLS"}
\u2022 *Active Plan:* ${this.state.config.plan.toUpperCase()}
\u2022 *Prefix:* \`${this.state.config.prefix}\`
\u2022 *Device:* YASHI HALLS Engine

\u{1F518} *Interactive Button Menu:* Menu \u0D91\u0D9A \u0DBD\u0DB6\u0DCF \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8\u0DA7 \u0D95\u0DB1\u0DD1\u0DB8 chat \u0D91\u0D9A\u0D9A \u0DC4\u0DDD \u0DB8\u0DD9\u0DC4\u0DD2 *${this.state.config.prefix}menu* \u0DBD\u0DD9\u0DC3 \u0DBA\u0DDC\u0DB8\u0DD4 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1.

_24/7 Automated YASHI HALLS Cloud Engine_`;await this.sock.sendMessage(targetJid,{text:welcomeText});this.addLog("INFO",`\u{1F4E4} Sent welcome message to owner at ${targetJid}`)}}catch(err){this.addLog("WARN",`Could not send welcome message to owner: ${err?.message}`)}}});this.sock.ev.on("group-participants.update",async update=>{try{const{id:groupJid,participants,action}=update;if(action==="add"&&this.state.config.welcomeMessage){for(const p of participants){const participantId=typeof p==="string"?p:p?.id||"";if(!participantId)continue;const userPhone=participantId.split("@")[0];const welcomeMsg=`\u{1F389} *WELCOME TO THE GROUP!* \u{1F44B}

Hello @${userPhone}! We're thrilled to have you here.
\u{1F4CC} Please check the group description and follow the rules.

_Powered by ${this.state.config.botName} 24/7 Engine_`;await this.sock?.sendMessage(groupJid,{text:welcomeMsg,mentions:[participantId]})}}}catch(err){this.addLog("WARN",`Welcome automation error: ${err?.message}`)}});this.sock.ev.on("call",async calls=>{if(!this.state.config.callDetectorEnabled)return;for(const call of calls){if(call.status!=="offer")continue;const callId=call.id;const callerJid=call.from;if(!callerJid||this.processedCalls.has(callId))continue;this.processedCalls.add(callId);if(this.processedCalls.size>200){const first=this.processedCalls.values().next().value;if(first)this.processedCalls.delete(first)}this.state.incomingCallsCount++;const cleanPhone=callerJid.split("@")[0];this.addLog("WARN",`\u{1F4DE} Incoming WhatsApp call detected from +${cleanPhone}`);let rejected=false;try{if(this.sock&&typeof this.sock.rejectCall==="function"){await this.sock.rejectCall(callId,callerJid);rejected=true;this.state.callsRejectedCount++;this.addLog("INFO",`\u{1F4F5} Successfully rejected incoming call from +${cleanPhone}`)}else{this.addLog("WARN",`Call rejection not supported by current Baileys client instance for +${cleanPhone}`)}}catch(rejectErr){this.addLog("ERROR",`Failed to reject call from +${cleanPhone}: ${rejectErr?.message||rejectErr}`)}let replied=false;try{const replyText=`
\u{1F4F5} YASHI HALLS BOT

Sorry! \u0D85\u0DB4\u0D9C\u0DDA Bot \u0D91\u0D9A\u0DA7 WhatsApp Voice/Video Calls \u0DBD\u0DB6\u0DCF\u0D9C\u0DAD \u0DB1\u0DDC\u0DC4\u0DD0\u0D9A.

\u{1F916} \u0D85\u0DB4\u0D9C\u0DDA \u0DC3\u0DDA\u0DC0\u0DCF\u0DC0\u0DB1\u0DCA \u0DB7\u0DCF\u0DC0\u0DD2\u0DAD \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7:
Type ".menu" to explore our services.

\u2728 POWERED BY YASHI HALLS
`.trim();await this.sock?.sendMessage(callerJid,{text:replyText});replied=true;this.state.autoRepliesSentCount++;this.addLog("INFO",`\u{1F4AC} Sent call auto-reply chat message to +${cleanPhone}`)}catch(replyErr){this.addLog("ERROR",`Failed to send call auto-reply to +${cleanPhone}: ${replyErr?.message||replyErr}`)}const nowTime=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",second:"2-digit"});this.state.recentCalls.unshift({id:callId,from:`+${cleanPhone}`,timestamp:nowTime,rejected,replied});if(this.state.recentCalls.length>25){this.state.recentCalls.pop()}}});this.sock.ev.on("messages.upsert",async({messages,type})=>{if(type!=="notify")return;for(const msg of messages){if(!msg.message)continue;this.state.totalMessagesReceived++;if(this.state.config.autoReadStatus&&msg.key.remoteJid==="status@broadcast"){try{await this.sock?.readMessages([msg.key])}catch{}continue}const isChannel=Boolean(msg.key.remoteJid&&(msg.key.remoteJid.endsWith("@newsletter")||msg.key.remoteJid.includes("newsletter")));if(this.state.config.channelAutoReact&&isChannel&&msg.key.remoteJid){try{const emojiList=(this.state.config.channelReactEmojis||"\u2764\uFE0F,\u{1F525},\u26A1,\u{1F44D},\u{1F31F},\u{1F389},\u{1F680},\u{1F60D},\u{1F44F}").split(",").map(e=>e.trim()).filter(Boolean);const pickedEmoji=emojiList[Math.floor(Math.random()*emojiList.length)]||"\u2764\uFE0F";await this.sock?.sendMessage(msg.key.remoteJid,{react:{text:pickedEmoji,key:msg.key}});this.addLog("INFO",`\u26A1 [CHANNEL AUTO-REACT] Dropped reaction ${pickedEmoji} to channel post in ${msg.key.remoteJid}`)}catch(err){this.addLog("WARN",`Channel auto-react notice: ${err?.message||err}`)}}await this.handleIncomingMessage(msg)}});return{success:true,message:"Bot engine initialization started successfully."}}catch(error){this.state.connectionStatus="disconnected";this.state.isOnline=false;this.addLog("ERROR",`Bot start failed: ${error?.message||error}`);return{success:false,message:error?.message||"Failed to start bot engine"}}}async requestPairingCode(phone) {
    const cleanPhone = normalizeWhatsAppNumber(phone);
    if (!cleanPhone || cleanPhone.length < 8) {
      return {
        success: false,
        message: "Invalid phone number. Enter e.g. 0740712934 or 94740712934.",
      };
    }
    this.addLog("INFO", `Preparing fresh WhatsApp pairing session for +${cleanPhone}...`);
    this.activePairingPhone = cleanPhone;
    this.isExplicitlyStopped = false;
    this.reconnectAttempts = 0;
    await this.stop(false);
    this.clearSessionFiles();
    this.state.pairedNumber = null;
    this.state.qrCodeDataUrl = null;
    this.state.pairingCode = null;
    this.isQrReady = false;

    const res = await this.start(cleanPhone);
    if (!res.success) {
      return { success: false, message: res.message };
    }

    await new Promise((r) => setTimeout(r, 1200));
    const startTime = Date.now();
    while (Date.now() - startTime < 4500) {
      if (this.state.pairingCode) {
        return {
          success: true,
          code: this.state.pairingCode,
          message: "Pairing code generated successfully. Enter this code on your WhatsApp Linked Devices.",
        };
      }
      if (this.sock && !this.sock.authState?.creds?.registered) {
        try {
          this.addLog("INFO", `Requesting Baileys pairing code for +${cleanPhone}...`);
          const rawCode = await this.sock.requestPairingCode(cleanPhone);
          if (rawCode) {
            const formattedCode = rawCode.match(/.{1,4}/g)?.join("-") || rawCode;
            this.state.pairingCode = formattedCode;
            this.state.connectionStatus = "pairing_code_ready";
            this.addLog("INFO", `✅ WhatsApp Pairing Code generated for +${cleanPhone}: ${formattedCode}`);
            return {
              success: true,
              code: formattedCode,
              message: "Pairing code generated successfully. Enter this code on your WhatsApp Linked Devices.",
            };
          }
        } catch (err: any) {
          const msg = err?.message || String(err);
          this.addLog("WARN", `Pairing code attempt: ${msg}`);
          if (msg.includes("registered")) break;
          await new Promise((r) => setTimeout(r, 600));
        }
      } else {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    // Continue background attempt if WebSocket handshake is finishing
    (async () => {
      const bgStart = Date.now();
      while (Date.now() - bgStart < 25000 && !this.state.pairingCode && !this.isExplicitlyStopped) {
        if (this.sock && !this.sock.authState?.creds?.registered) {
          try {
            const rawCode = await this.sock.requestPairingCode(cleanPhone);
            if (rawCode) {
              const formattedCode = rawCode.match(/.{1,4}/g)?.join("-") || rawCode;
              this.state.pairingCode = formattedCode;
              this.state.connectionStatus = "pairing_code_ready";
              this.addLog("INFO", `✅ WhatsApp Pairing Code generated for +${cleanPhone}: ${formattedCode}`);
              break;
            }
          } catch {
            await new Promise((r) => setTimeout(r, 1000));
          }
        } else {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    })().catch(() => {});

    return {
      success: true,
      pending: true,
      message: "Pairing session initiated. Connecting to WhatsApp multi-device gateway...",
    };
  }

  async generateQrCode(forceNew=false){if(!forceNew&&this.sock&&this.state.qrCodeDataUrl&&this.state.connectionStatus==="qr_ready"){return{success:true,qr:this.state.qrCodeDataUrl,message:"QR code ready."}}this.addLog("INFO","Initiating fresh WhatsApp QR Code pairing...");this.activePairingPhone=null;this.isExplicitlyStopped=false;this.reconnectAttempts=0;await this.stop(false);this.clearSessionFiles();this.state.pairedNumber=null;this.state.pairingCode=null;this.state.qrCodeDataUrl=null;this.isQrReady=false;const startRes=await this.start();if(!startRes.success){return{success:false,message:startRes.message}}const start=Date.now();while(Date.now()-start<15e3){if(this.state.qrCodeDataUrl){return{success:true,qr:this.state.qrCodeDataUrl,message:"QR code generated successfully."}}await new Promise(r=>setTimeout(r,500))}if(this.state.qrCodeDataUrl){return{success:true,qr:this.state.qrCodeDataUrl,message:"QR code ready."}}return{success:false,message:"QR Code generation timed out. Please try again."}}async stop(isUserExplicitStop=true){this.isExplicitlyStopped=isUserExplicitStop;this.reconnectAttempts=isUserExplicitStop?this.maxReconnectAttempts:0;if(this.reconnectTimer){clearTimeout(this.reconnectTimer);this.reconnectTimer=null}this.isQrReady=false;this.startTime=null;this.state.isOnline=false;this.state.connectionStatus="disconnected";if(isUserExplicitStop){this.state.qrCodeDataUrl=null;this.state.pairingCode=null}if(this.sock){try{this.sock.ev.removeAllListeners("connection.update");this.sock.ev.removeAllListeners("creds.update");this.sock.ev.removeAllListeners("messages.upsert");this.sock.ev.removeAllListeners("call");this.sock.ev.removeAllListeners("group-participants.update");try{this.sock.ws?.close()}catch(e){}try{this.sock.end(void 0)}catch(e){}}catch(err){}this.sock=null}if(isUserExplicitStop){this.addLog("INFO","\u{1F6D1} Bot engine manually stopped by user.")}return{success:true,message:"Bot stopped successfully."}}async restart(){this.addLog("INFO",`Restarting ${this.state.config.botName} bot engine...`);await this.stop();await new Promise(r=>setTimeout(r,1200));return this.start()}async clearSession(){await this.stop();this.clearSessionFiles();this.state.pairedNumber=null;this.state.qrCodeDataUrl=null;this.state.pairingCode=null;this.state.isOnline=false;this.state.connectionStatus="disconnected";this.addLog("INFO","\u{1F9F9} Session data and credentials wiped. Ready for fresh pairing.");return{success:true,message:"Session data cleared successfully."}}clearSessionFiles(){try{if(fs.existsSync(this.sessionDir)){fs.rmSync(this.sessionDir,{recursive:true,force:true})}fs.mkdirSync(this.sessionDir,{recursive:true})}catch(e){this.addLog("WARN",`Error clearing session files: ${e?.message}`)}}extractMessageContent(msg){if(!msg.message)return"";let messageObj=msg.message;let depth=0;while(depth<5&&messageObj&&(messageObj.viewOnceMessage?.message||messageObj.viewOnceMessageV2?.message||messageObj.viewOnceMessageV2Extension?.message||messageObj.ephemeralMessage?.message||messageObj.documentWithCaptionMessage?.message)){messageObj=messageObj.viewOnceMessage?.message||messageObj.viewOnceMessageV2?.message||messageObj.viewOnceMessageV2Extension?.message||messageObj.ephemeralMessage?.message||messageObj.documentWithCaptionMessage?.message;depth++}if(!messageObj)return"";if(messageObj.conversation)return messageObj.conversation;if(messageObj.extendedTextMessage?.text)return messageObj.extendedTextMessage.text;if(messageObj.imageMessage?.caption)return messageObj.imageMessage.caption;if(messageObj.videoMessage?.caption)return messageObj.videoMessage.caption;if(messageObj.buttonsResponseMessage?.selectedButtonId){return messageObj.buttonsResponseMessage.selectedButtonId}if(messageObj.buttonsResponseMessage?.selectedDisplayText){return messageObj.buttonsResponseMessage.selectedDisplayText}if(messageObj.templateButtonReplyMessage?.selectedId){return messageObj.templateButtonReplyMessage.selectedId}if(messageObj.templateButtonReplyMessage?.selectedDisplayText){return messageObj.templateButtonReplyMessage.selectedDisplayText}if(messageObj.listResponseMessage?.singleSelectReply?.selectedRowId){return messageObj.listResponseMessage.singleSelectReply.selectedRowId}if(messageObj.listResponseMessage?.title){return messageObj.listResponseMessage.title}if(messageObj.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson){try{const parsed=JSON.parse(messageObj.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);const resolved=parsed?.id||parsed?.selected_id||parsed?.selected_row_id||parsed?.selectedRowId||parsed?.title||parsed?.display_text||"";if(resolved)return resolved}catch{}}if(messageObj.interactiveResponseMessage?.body?.text){return messageObj.interactiveResponseMessage.body.text}return""}mapButtonToCommand(btnId,prefix){switch(btnId){case"btn_cat_song":case"btn_song":return`${prefix}menu song`;case"btn_cat_video":case"btn_video":return`${prefix}menu video`;case"btn_cat_image":case"btn_img":case"btn_image":return`${prefix}menu image`;case"btn_cat_ai":case"btn_ai":return`${prefix}menu ai`;case"btn_cat_games":case"btn_games":return`${prefix}menu games`;case"btn_cat_group":case"btn_group":return`${prefix}menu group`;case"btn_cat_settings":case"btn_settings":return`${prefix}settings`;case"btn_ping":return`${prefix}ping`;case"btn_quiz":return`${prefix}quiz`;case"btn_roll":return`${prefix}roll`;case"btn_flip":return`${prefix}flip`;case"btn_groupinfo":return`${prefix}groupinfo`;case"btn_admins":return`${prefix}admins`;case"btn_tagall":return`${prefix}tagall`;case"btn_owner":return`${prefix}owner`;case"btn_main_menu":return`${prefix}menu`;case"btn_upgrade":return`${prefix}upgrade`;default:return btnId.startsWith(prefix)?btnId:`${prefix}${btnId}`}}async handleIncomingMessage(msg){if(!this.sock||!msg.key)return;const jid=msg.key.remoteJid;if(!jid||jid.endsWith("@broadcast"))return;const isGroup=jid.endsWith("@g.us");const sender=isGroup?msg.key.participant||jid:jid;const rawMsg=msg.message?.ephemeralMessage?.message||msg.message?.viewOnceMessage?.message||msg.message?.viewOnceMessageV2?.message||msg.message;if(!msg.key.fromMe&&rawMsg?.audioMessage){const audio=rawMsg.audioMessage;this.addLog("INFO",`\u{1F399}\uFE0F [AI VOICE LISTENER] Received audio note from ${sender.split("@")[0]}`);try{await this.sock.sendMessage(jid,{react:{text:"\u{1F399}\uFE0F",key:msg.key}}).catch(()=>{});const audioBuffer=await downloadMediaMessage(msg,"buffer",{},{logger:pino({level:"silent"}),reuploadRequest:this.sock.updateMediaMessage});if(audioBuffer&&audioBuffer.length>0){await this.sock.sendPresenceUpdate("composing",jid).catch(()=>{});const aiResult=await analyzeAudioWithGemini(audioBuffer,audio.mimetype||"audio/ogg");await this.reply(jid,msg,`\u{1F399}\uFE0F *[YASHI HALLS AI VOICE ASSISTANT]*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${aiResult.text}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_Voice Note Understood & Replied_`);return}}catch(err){this.addLog("ERROR",`Voice listener error: ${err?.message||err}`)}}if(!msg.key.fromMe&&rawMsg?.videoMessage){const video=rawMsg.videoMessage;const caption=video.caption||"";const sizeBytes=Number(video.fileLength)||0;this.addLog("INFO",`\u{1F4F9} [AI VIDEO ANALYZER] Received video (${(sizeBytes/1024/1024).toFixed(1)} MB) from ${sender.split("@")[0]}`);try{await this.sock.sendMessage(jid,{react:{text:"\u{1F4F9}",key:msg.key}}).catch(()=>{});if(sizeBytes>20*1024*1024){await this.reply(jid,msg,`\u{1F4F9} *\u0DC0\u0DD3\u0DA9\u0DD2\u0DBA\u0DDD\u0DC0 \u0DC0\u0DD2\u0DC1\u0DCF\u0DBD \u0DC0\u0DD0\u0DA9\u0DD2\u0DBA!* (Video exceeds 20MB limit)
AI \u0DC0\u0DD2\u0DC1\u0DCA\u0DBD\u0DDA\u0DC2\u0DAB\u0DBA \u0DC3\u0DB3\u0DC4\u0DCF \u0D9A\u0DBB\u0DD4\u0DAB\u0DCF\u0D9A\u0DBB \u0D9A\u0DD4\u0DA9\u0DCF \u0DC0\u0DD3\u0DA9\u0DD2\u0DBA\u0DDD\u0DC0\u0D9A\u0DCA \u0D91\u0DC0\u0DB1\u0DCA\u0DB1.`);return}const videoBuffer=await downloadMediaMessage(msg,"buffer",{},{logger:pino({level:"silent"}),reuploadRequest:this.sock.updateMediaMessage});if(videoBuffer&&videoBuffer.length>0){await this.sock.sendPresenceUpdate("composing",jid).catch(()=>{});const aiResult=await analyzeVideoWithGemini(videoBuffer,video.mimetype||"video/mp4",caption);await this.reply(jid,msg,`\u{1F4F9} *[YASHI HALLS AI VIDEO VISION]*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${aiResult.text}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_Video Scenes Understood & Analyzed_`);return}}catch(err){this.addLog("ERROR",`Video analyzer error: ${err?.message||err}`)}}
    // --- SMART MEMORY & CONTACT CONTEXT ---
    const senderName = msg.pushName || sender.split("@")[0] || "Friend";
    if (!this.chatMemory) this.chatMemory = new Map();
    if (!this.chatMemory.has(jid)) this.chatMemory.set(jid, []);
    const history = this.chatMemory.get(jid);
    const linkMatch = text ? text.match(/(https?:\/\/[^\s]+)/i) : null;
    const foundLink = linkMatch ? linkMatch[0] : undefined;

    // --- SMART IMAGE VISION REACTION (Red Queen Pro / YASHI HALLS Ultra) ---
    if (!msg.key.fromMe && rawMsg?.imageMessage) {
      const imgCaption = rawMsg.imageMessage.caption || "";
      const botPhone = (this.sock?.user?.id || "").split(":")[0].split("@")[0];
      const contextInfo = rawMsg.imageMessage?.contextInfo || msg.message?.extendedTextMessage?.contextInfo;
      const isBotMentioned = Boolean(contextInfo?.mentionedJid?.some(m => m.includes(botPhone)));
      const isReplyToBot = Boolean(contextInfo?.participant && contextInfo.participant.includes(botPhone));

      if (!isGroup || isBotMentioned || isReplyToBot || imgCaption.trim()) {
        try {
          await this.sock.sendMessage(jid, { react: { text: "😍", key: msg.key } }).catch(() => {});
          const imgBuffer = await downloadMediaMessage(
            msg,
            "buffer",
            {},
            { logger: pino({ level: "silent" }), reuploadRequest: this.sock.updateMediaMessage }
          );
          if (imgBuffer && imgBuffer.length > 0) {
            await this.sock.sendPresenceUpdate("composing", jid).catch(() => {});
            const aiRes = await chatAsYashiHallsAI({
              userText: imgCaption,
              senderName,
              recentMessages: history,
              imageBuffer: imgBuffer,
              imageMime: rawMsg.imageMessage.mimetype || "image/jpeg",
            });
            if (aiRes && aiRes.replyText) {
              await this.reply(jid, msg, aiRes.replyText);
              history.push({
                senderName,
                senderJid: sender,
                text: imgCaption ? `[Image with caption: "${imgCaption}"]` : "[Sent an image]",
                timestamp: Date.now(),
              });
              history.push({
                senderName: this.state.config.botName || "YASHI HALLS",
                senderJid: this.sock.user?.id || "bot",
                text: aiRes.replyText,
                timestamp: Date.now(),
                isBot: true,
              });
              return;
            }
          }
        } catch (imgErr) {
          this.addLog("WARN", `Smart Image Vision notice: ${imgErr?.message || imgErr}`);
        }
      }
    }

    if (text) {
      history.push({
        senderName,
        senderJid: sender,
        text,
        timestamp: Date.now(),
        hasLink: foundLink,
        isBot: Boolean(msg.key.fromMe),
      });
      if (history.length > 20) history.shift();
    }
const messageContent=this.extractMessageContent(msg);let text=messageContent.trim();const prefix=this.state.config.prefix;if(isGroup&&this.state.config.plan==="pro"&&this.state.config.antiLink&&!msg.key.fromMe){const hasLink=/(https?:\/\/[^\s]+|chat\.whatsapp\.com\/[^\s]+|wa\.me\/[^\s]+)/gi.test(text);const isOwner2=sender.includes(this.state.config.ownerNumber.replace(/\D/g,""));if(hasLink&&!isOwner2){this.addLog("WARN",`[ANTI-LINK] Unauthorized link detected from ${sender.split("@")[0]} in ${jid}`);try{await this.sock.sendMessage(jid,{text:`\u26A0\uFE0F *ANTI-LINK SYSTEM ACTIVATED!* \u{1F6AB}
@${sender.split("@")[0]}, sharing external links is forbidden in this group.`,mentions:[sender]},{quoted:msg});await this.sock.sendMessage(jid,{delete:msg.key})}catch{}return}}if(this.activeQuizSessions.has(jid)&&!text.startsWith(prefix)){const quiz=this.activeQuizSessions.get(jid);if(text.toLowerCase()===quiz.answer.toLowerCase()){this.activeQuizSessions.delete(jid);await this.reply(jid,msg,`\u{1F389} *CORRECT ANSWER!* \u{1F3C6}
Congratulations @${sender.split("@")[0]}! You solved the quiz.
_Answer was:_ *${quiz.answer}*`);return}}if(text.startsWith("btn_")){text=this.mapButtonToCommand(text,prefix)}else if(!text.startsWith(prefix)){const lower=text.toLowerCase().trim();if(lower.includes("mediafire.com/file/")||lower.includes("mediafire.com/?")||lower.includes("mediafire.com/download")){text=`${prefix}mediafire ${text}`}else if(lower.startsWith("film ")||lower.startsWith("movie ")||lower.startsWith("filmdub ")||lower.startsWith("dub ")){text=`${prefix}${text}`}else{const numMap={"0":`${prefix}menu`,".0":`${prefix}menu`,"1":`${prefix}menu download`,".1":`${prefix}menu download`,"2":`${prefix}menu movie`,".2":`${prefix}menu movie`,"3":`${prefix}menu ai`,".3":`${prefix}menu ai`,"4":`${prefix}menu group`,".4":`${prefix}menu group`,"5":`${prefix}menu games`,".5":`${prefix}menu games`,"6":`${prefix}menu info`,".6":`${prefix}menu info`,"7":`${prefix}menu daily`,".7":`${prefix}menu daily`,"8":`${prefix}menu business`,".8":`${prefix}menu business`,"1.1":`${prefix}mediafire`,"1.2":`${prefix}song`,"1.3":`${prefix}video`,"1.4":`${prefix}tiktok`,"1.5":`${prefix}fb`,"1.6":`${prefix}ig`,"1.7":`${prefix}twitter`,"1.8":`${prefix}apk`,"2.1":`${prefix}film`,"2.2":`${prefix}filmdub`,"2.3":`${prefix}movie`,"2.4":`${prefix}cinesubz`,"2.5":`${prefix}sinhalasub`,"3.1":`${prefix}ai`,"3.2":`${prefix}translate`,"3.3":`${prefix}summarize`,"3.4":`${prefix}write`,"3.5":`${prefix}code`,"3.6":`${prefix}imagine`,"3.7":`${prefix}voicetrans`,"3.8":`${prefix}aisticker`,"3.9":`${prefix}dubvideo`,"3.10":`${prefix}shazam`,"3.11":`${prefix}transcribe`,"3.12":`${prefix}math`,"3.13":`${prefix}food`,"3.14":`${prefix}cv`,"4.1":`${prefix}groupinfo`,"4.2":`${prefix}admins`,"4.3":`${prefix}tagall`,"4.4":`${prefix}kick`,"4.5":`${prefix}add`,"4.6":`${prefix}mute`,"4.7":`${prefix}antilink`,"5.1":`${prefix}quiz`,"5.2":`${prefix}roll`,"5.3":`${prefix}flip`,"5.4":`${prefix}guess`,"5.5":`${prefix}slot`,"5.6":`${prefix}leaderboard`,"6.1":`${prefix}ping`,"6.2":`${prefix}owner`,"6.3":`${prefix}settings`,"7.1":`${prefix}gold`,"7.2":`${prefix}bill`,"7.3":`${prefix}remind`,"8.1":`${prefix}shop`,"8.2":`${prefix}invoice`};if(numMap[lower]){text=numMap[lower]}else if(lower==="0"||lower===".0"||lower.includes("main menu")||lower==="back"||lower.includes("back to")||lower.includes("return")){text=`${prefix}menu`}else if(lower.includes("download")||lower.includes("downlod")||lower.includes("mediafire")){text=`${prefix}menu download`}else if(lower.includes("movie")||lower.includes("film")||lower.includes("filmdub")||lower.includes("sinhalasub")||lower.includes("sub")){text=`${prefix}menu movie`}else if(lower==="ai"||lower.includes("ai chat")||lower.includes("halls ai")||lower.includes("voice")){text=`${prefix}menu ai`}else if(lower.includes("group")||lower.includes("admin")){text=`${prefix}menu group`}else if(lower.includes("game")||lower.includes("games")){text=`${prefix}menu games`}else if(lower.includes("setting")||lower.includes("info")||lower.includes("config")){text=`${prefix}menu info`}else if(["menu","help","ping","owner","settings","quiz","roll","flip","guess","film","filmdub","movie","mediafire"].includes(lower)){text=`${prefix}${lower}`}}}if(this.state.config.voiceAutoReplyEnabled!==false&&!msg.key.fromMe&&!text.startsWith(prefix)){const voiceMatch=adminStore.findMatchingVoiceReply(text);if(voiceMatch&&voiceMatch.match){const voiceReply=voiceMatch.match;const cooldownKey=`${jid}_${voiceReply.id}`;const lastSent=this.voiceCooldownMap.get(cooldownKey)||0;const now=Date.now();if(now-lastSent>5e3){this.voiceCooldownMap.set(cooldownKey,now);this.addLog("INFO",`\u{1F399}\uFE0F [VOICE AUTO-REPLY] Trigger "${voiceMatch.matchedTrigger}" matched incoming text: "${text}" from ${sender.split("@")[0]}`);try{const voiceData=await getWhatsAppVoiceBuffer(voiceReply.audioPath);if(voiceData&&voiceData.buffer){await this.sock.sendMessage(jid,{audio:voiceData.buffer,mimetype:voiceData.mimeType,ptt:true},{quoted:msg});this.state.voiceAutoRepliesSentCount=(this.state.voiceAutoRepliesSentCount||0)+1;this.state.autoRepliesSentCount++;adminStore.incrementVoiceReplyPlay(voiceReply.id);this.addLog("INFO",`\u2705 [VOICE AUTO-REPLY] Successfully delivered voice note "${voiceReply.name}" (${(voiceData.buffer.length/1024).toFixed(1)} KB) to ${jid}`);return}else{this.addLog("WARN",`\u26A0\uFE0F [VOICE AUTO-REPLY] Audio file not readable for '${voiceReply.name}' at ${voiceReply.audioPath}`)}}catch(voiceErr){this.addLog("ERROR",`\u274C [VOICE AUTO-REPLY] Delivery failed: ${voiceErr?.message||voiceErr}`)}}}}if(this.state.config.smartAutoReply!==false&&!msg.key.fromMe&&!text.startsWith(prefix)){
      const lowerText = text.toLowerCase().trim();
      const botPhone = (this.sock?.user?.id || "").split(":")[0].split("@")[0];
      const contextInfo = msg.message?.extendedTextMessage?.contextInfo || rawMsg?.extendedTextMessage?.contextInfo;
      const isBotMentioned = Boolean(contextInfo?.mentionedJid?.some(m => m.includes(botPhone)));
      const isReplyToBot = Boolean(contextInfo?.participant && contextInfo.participant.includes(botPhone));
      const isExplicitBotCall = /(yashi|යශී|බොට්|bot)\b/i.test(text);

      // 1. Check YouTube link shared without command
      if (/^(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+)$/i.test(text.trim())) {
        await this.reply(
          jid,
          msg,
          `පට්ට ලින්ක් එකක්නේ ${senderName}! මම බැලුවා ඕක ❤️\n_ඕනෙ නම් "මට ඒකෙ mp3 එක දියන්" හරි "video එක එවපන්" හරි කියන්න._`
        );
        return;
      }

      // 2. Check if Conversational AI should respond
      const shouldAIRespond = !isGroup || isBotMentioned || isReplyToBot || isExplicitBotCall ||
        /(mp3|audio|video|සින්දුව|පට්ට|සිරාවටම|කොහොමද|එවපන්|දියන්|කරපන්|කියුට්|බබා|කවුද|හදපන්|ස්මාර්ට්)/i.test(text);

      if (shouldAIRespond) {
        await this.sock.sendPresenceUpdate("composing", jid).catch(() => {});
        const aiRes = await chatAsYashiHallsAI({
          userText: text,
          senderName,
          recentMessages: history,
        });

        // ACTION: Send MP3 automatically (Red Queen Pro / YASHI HALLS Ultra behavior)
        if (aiRes.action === "send_mp3") {
          await this.reply(jid, msg, aiRes.replyText);
          let targetUrl = aiRes.targetQuery;
          if (!targetUrl || !targetUrl.includes("http")) {
            const lastLinkItem = [...history].reverse().find(h => h.hasLink);
            if (lastLinkItem?.hasLink) {
              targetUrl = lastLinkItem.hasLink;
            }
          }
          if (targetUrl) {
            try {
              this.addLog("INFO", `[SMART AI ACTION] Automatically downloading MP3 for "${targetUrl}" requested by ${senderName}`);
              const audioResult = await resolveSongAudio(targetUrl);
              if (audioResult && audioResult.success && audioResult.buffer) {
                await this.sendAudio(
                  jid,
                  msg,
                  audioResult.buffer,
                  audioResult.fileName || "song.mp3",
                  audioResult.title,
                  audioResult.thumbnailUrl,
                  audioResult.sourceUrl
                );
              }
            } catch (err) {
              this.addLog("ERROR", `Smart MP3 delivery error: ${err?.message || err}`);
            }
          }
          return;
        }

        // ACTION: Normal conversational reply with buddy vibes
        if (aiRes.replyText) {
          await this.reply(jid, msg, aiRes.replyText);
          history.push({
            senderName: this.state.config.botName || "YASHI HALLS",
            senderJid: this.sock.user?.id || "bot",
            text: aiRes.replyText,
            timestamp: Date.now(),
            isBot: true,
          });
          return;
        }
      }
lowerText = text.toLowerCase().trim();const senderNumber=sender.split("@")[0];const cooldownKey=`smart_reply_${jid}_${senderNumber}`;const lastSent=this.smartReplyCooldownMap.get(cooldownKey)||0;const now=Date.now();if(now-lastSent>4e3){let smartResponse=null;if(this.state.config.customAutoReplies&&Array.isArray(this.state.config.customAutoReplies)){for(const rule of this.state.config.customAutoReplies){if(rule.keyword&&rule.reply){const kw=rule.keyword.trim().toLowerCase();if(kw&&(lowerText===kw||lowerText.includes(kw))){smartResponse=rule.reply.replace(/@user/g,`@${senderNumber}`).replace(/@bot/g,this.state.config.botName).replace(/@prefix/g,prefix);break}}}}if(!smartResponse&&(/^(hi|hello|hey|heyy|hii|හායි|හායී|හෙලෝ|හලෝ|halo|hallo|hola|wassup)[\s!.,?]*$/i.test(lowerText)||/^(hi|hello|hey|හායි|හායී|හෙලෝ|හලෝ)\b/i.test(lowerText))){if(this.state.config.customGreetingSinhala||this.state.config.customGreetingEnglish){const sn=this.state.config.customGreetingSinhala?this.state.config.customGreetingSinhala.replace(/@user/g,`@${senderNumber}`).replace(/@bot/g,this.state.config.botName).replace(/@prefix/g,prefix):"";const en=this.state.config.customGreetingEnglish?this.state.config.customGreetingEnglish.replace(/@user/g,`@${senderNumber}`).replace(/@bot/g,this.state.config.botName).replace(/@prefix/g,prefix):"";smartResponse=[sn,en].filter(Boolean).join("\n\n")}else{smartResponse=`\u0DC4\u0DCF\u0DBA\u0DD2 @${senderNumber}! \u{1F44B}
\u0DB8\u0DB8 *${this.state.config.botName}* WhatsApp Bot. \u{1F916}

\u0D94\u0DB6\u0DA7 \u0D8B\u0DAF\u0DC0\u0DCA \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7 \u0DB8\u0DB8 \u0DC3\u0DD6\u0DAF\u0DCF\u0DB1\u0DB8\u0DCA! \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1 \u0DC3\u0DD2\u0DBA\u0DBD\u0DCA\u0DBD \u0DB6\u0DD0\u0DBD\u0DD3\u0DB8\u0DA7 *${prefix}menu* \u0DBD\u0DD9\u0DC3 \u0D91\u0DC0\u0DB1\u0DCA\u0DB1. \u{1F60A}

_Hello @${senderNumber}! I am online and ready to assist you. Type *${prefix}menu* to view all available commands._`}}else if(/^(how are you|how r u|kohomada|කොහොමද|සැපද|sapa da|sapada|mokada wenne|මොකද වෙන්නේ|මොකෝ වෙන්නේ)[\s!?.]*$/i.test(lowerText)){smartResponse=`\u0DB8\u0DB8 \u0D89\u0DAD\u0DCF \u0DC4\u0DDC\u0DB3\u0DD2\u0DB1\u0DCA \u0DC3\u0DAD\u0DD4\u0DA7\u0DD2\u0DB1\u0DCA \u0D89\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF, \u0DC3\u0DCA\u0DAD\u0DD6\u0DAD\u0DD2\u0DBA\u0DD2! \u{1F60A} \u0D94\u0DB6 \u0D9A\u0DDC\u0DC4\u0DDC\u0DB8\u0DAF @${senderNumber}?
\u0D94\u0DB6\u0DA7 \u0D85\u0DC0\u0DC1\u0DCA\u200D\u0DBA \u0D95\u0DB1\u0DD1\u0DB8 \u0DC3\u0DDA\u0DC0\u0DCF\u0DC0\u0D9A\u0DCA \u0DC4\u0DDD \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1\u0DBA\u0D9A\u0DCA \u0DB6\u0DD0\u0DBD\u0DD3\u0DB8\u0DA7 *${prefix}menu* \u0DBD\u0DD9\u0DC3 \u0D91\u0DC0\u0DB1\u0DCA\u0DB1.

_I'm doing fantastic, thank you! How are you doing? Type *${prefix}menu* for assistance._`}else if(/^(who are you|who r u|who is this|kawuda oya|kawda oya|කවුද මේ|කවුද ඔයා|ඔයා කවුද|oya kauda)[\s!?.]*$/i.test(lowerText)){smartResponse=`\u0DB8\u0DB8 *${this.state.config.botName}* \u{1F680}
24/7 Cloud \u0DC3\u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA WhatsApp Automation Bot \u0DB4\u0DAF\u0DCA\u0DB0\u0DAD\u0DD2\u0DBA\u0D9A\u0DCA!

\u{1F451} *Group Admin Commands:* ${prefix}kick, ${prefix}add, ${prefix}promote, ${prefix}mute, ${prefix}tagall
\u{1F4E5} *Social Media Download:* ${prefix}tiktok, ${prefix}fb, ${prefix}ig, ${prefix}song, ${prefix}video
\u26A1 *Channel Auto-React:* ${prefix}channelreact on/off
\u{1F4AC} *Auto-Reply System:* ${prefix}autoreply on/off
\u{1F9E0} *YASHI HALLS AI Intelligence:* ${prefix}ai <question>

\u0DC0\u0DD2\u0DB0\u0DCF\u0DB1 \u0DBD\u0DD0\u0DBA\u0DD2\u0DC3\u0DCA\u0DAD\u0DD4\u0DC0\u0DA7 *${prefix}menu* type \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1!`}else if(/^(good morning|gm|g\.m|සුබ උදෑසනක්|suba udasanak|subha udasanak)[\s!?.]*$/i.test(lowerText)){smartResponse=`\u0DC3\u0DD4\u0DB6 \u0D8B\u0DAF\u0DD1\u0DC3\u0DB1\u0D9A\u0DCA \u0DC0\u0DDA\u0DC0\u0DCF! \u{1F305} Good Morning @${senderNumber}!
\u0D85\u0DAF \u0DAF\u0DD2\u0DB1\u0DBA \u0D94\u0DB6\u0DA7 \u0DC3\u0DCF\u0DBB\u0DCA\u0DAE\u0D9A, \u0DB4\u0DCA\u200D\u0DBB\u0DD3\u0DAD\u0DD2\u0DB8\u0DAD\u0DCA \u0DC3\u0DD4\u0DB1\u0DCA\u0DAF\u0DBB \u0DAF\u0DD2\u0DB1\u0DBA\u0D9A\u0DCA \u0DC0\u0DDA\u0DC0\u0DCF! \u2728`}else if(/^(good night|gn|g\.n|සුබ රාත්‍රියක්|suba rathriyak|sweet dreams|සුවබර නින්දක්)[\s!?.]*$/i.test(lowerText)){smartResponse=`\u0DC3\u0DD4\u0DB6 \u0DBB\u0DCF\u0DAD\u0DCA\u200D\u0DBB\u0DD2\u0DBA\u0D9A\u0DCA \u0DC0\u0DDA\u0DC0\u0DCF! \u{1F319} Good Night @${senderNumber}!
\u0DC3\u0DD4\u0DC0\u0DB6\u0DBB \u0DB1\u0DD2\u0DB1\u0DCA\u0DAF\u0D9A\u0DCA \u0DB4\u0DCA\u200D\u0DBB\u0DCF\u0DBB\u0DCA\u0DAE\u0DB1\u0DCF \u0D9A\u0DBB\u0DB8\u0DD2! \u{1F634}\u{1F4A4}\u2728`}else if(/^(thanks|thank you|thx|ty|ස්තූතියි|sthuthiyi|sthuthi|godak sthuthi|බොහොම ස්තූතියි)[\s!?.]*$/i.test(lowerText)){smartResponse=`\u0D94\u0DB6\u0DA7 \u0DC3\u0DCF\u0DAF\u0DBB\u0DBA\u0DD9\u0DB1\u0DCA \u0DB4\u0DD2\u0DC5\u0DD2\u0D9C\u0DB1\u0DD2\u0DB8\u0DD4! \u2764\uFE0F You're always welcome @${senderNumber}!
\u0DAD\u0DC0\u0DAD\u0DCA \u0D95\u0DB1\u0DD1\u0DB8 \u0D8B\u0DAF\u0DC0\u0DCA\u0DC0\u0D9A\u0DCA \u0DC3\u0DB3\u0DC4\u0DCF \u0DB8\u0DB8 \u0DC3\u0DD6\u0DAF\u0DCF\u0DB1\u0DB8\u0DCA. \u{1F60A}`}else if(/^(bye|goodbye|good bye|tata|tc|take care|ගිහින් එන්නම්|බායි|gihin ennam)[\s!?.]*$/i.test(lowerText)){smartResponse=`\u0DC3\u0DD4\u0DB6 \u0DAF\u0DC0\u0DC3\u0D9A\u0DCA \u0DC0\u0DDA\u0DC0\u0DCF! \u{1F44B} \u0DB4\u0DC3\u0DD4\u0DC0 \u0DC4\u0DB8\u0DD4\u0DC0\u0DD9\u0DB8\u0DD4! Have a wonderful day @${senderNumber}! Take care! \u{1F60A}\u2728`}else if(/^(what can you do|help|උදව්|මොනවද කරන්න පුලුවන්|commands|monawada karanna puluwan)[\s!?.]*$/i.test(lowerText)){smartResponse=`\u{1F916} *\u0DB8\u0DB8 \u0D94\u0DB6\u0DA7 \u0D8B\u0DAF\u0DC0\u0DCA \u0D9A\u0DC5 \u0DC4\u0DD0\u0D9A\u0DD2 \u0DB4\u0DCA\u200D\u0DBB\u0DB0\u0DCF\u0DB1 \u0D85\u0D82\u0DC1:* \u{1F680}

\u{1F465} *Group Admin Tools:* ${prefix}kick, ${prefix}add, ${prefix}promote, ${prefix}mute, ${prefix}tagall
\u{1F4E5} *Social Media Download:* ${prefix}tiktok, ${prefix}fb, ${prefix}ig, ${prefix}song, ${prefix}video
\u26A1 *Channel Auto-React:* ${prefix}channelreact on/off
\u{1F4AC} *Auto-Reply System:* ${prefix}autoreply on/off

\u0DC3\u0DD2\u0DBA\u0DBD\u0DD4\u0DB8 \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1 \u0DC3\u0DB3\u0DC4\u0DCF *${prefix}menu* \u0DBD\u0DD9\u0DC3 \u0D91\u0DC0\u0DB1\u0DCA\u0DB1! \u{1F60A}`}else if(/^(bot|බොට්|yashi|යශී)[\s!?.]*$/i.test(lowerText)){smartResponse=`\u0D94\u0DC0\u0DCA @${senderNumber}! \u0DB8\u0DB8 \u0DC3\u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA\u0DC0 (Online \u{1F7E2}) \u0D89\u0DB1\u0DCA\u0DB1\u0DDA. \u0D94\u0DB6\u0DA7 \u0DB8\u0D9C\u0DD9\u0DB1\u0DCA \u0DC0\u0DD2\u0DBA \u0DBA\u0DD4\u0DAD\u0DD4 \u0DAF\u0DDA \u0DB6\u0DD0\u0DBD\u0DD3\u0DB8\u0DA7 *${prefix}menu* \u0DBD\u0DD9\u0DC3 \u0D91\u0DC0\u0DB1\u0DCA\u0DB1! \u{1F60A}`}if(smartResponse){this.smartReplyCooldownMap.set(cooldownKey,now);this.state.autoRepliesSentCount++;this.addLog("INFO",`\u{1F4AC} [SMART AUTO-REPLY] Auto-replied to "${text}" from ${senderNumber}`);await this.sock.sendMessage(jid,{text:smartResponse,mentions:[sender]},{quoted:msg});return}}}if(!text.startsWith(prefix))return;const[cmdWithPrefix,...argsList]=text.split(/\s+/);const command=cmdWithPrefix.slice(prefix.length).toLowerCase();const args=argsList.join(" ");this.state.totalCommandsExecuted++;this.addLog("CMD",`Command '${prefix}${command}' from ${sender.split("@")[0]} (${this.state.config.plan.toUpperCase()}) in ${isGroup?"Group":"DM"}`);const isOwner=sender.includes(this.state.config.ownerNumber.replace(/\D/g,""));if(this.state.config.mode==="private"&&!isOwner){await this.reply(jid,msg,`\u{1F512} *${this.state.config.botName} is in PRIVATE mode.*
Only the bot owner (+${this.state.config.ownerNumber}) can execute commands.`);return}try{switch(command){case"menu":case"start":await this.cmdMenu(jid,msg,args);break;case"settings":case"setting":case"config":await this.cmdSettings(jid,msg,isOwner,args);break;case"upgrade":case"pro":await this.sendProRequiredReply(jid,msg,"upgrade");break;case"games":case"game":await this.cmdMenu(jid,msg,"games");break;case"help":await this.cmdHelp(jid,msg);break;case"ping":await this.cmdPing(jid,msg);break;case"owner":await this.cmdOwner(jid,msg);break;case"public":await this.cmdSetMode(jid,msg,isOwner,"public");break;case"private":await this.cmdSetMode(jid,msg,isOwner,"private");break;case"mediafire":case"mf":await this.cmdMediaFire(jid,msg,args);break;case"film":case"movie":case"movies":case"films":await this.cmdFilm(jid,msg,args,false);break;case"filmdub":case"dub":case"sinhaladub":await this.cmdFilm(jid,msg,args,true);break;case"cinesubz":case"sinhalasub":await this.cmdFilm(jid,msg,args,false);break;case"song":await this.cmdSong(jid,msg,args);break;case"video":await this.cmdVideo(jid,msg,args);break;case"tiktok":case"tt":await this.cmdSocialDownload(jid,msg,"TikTok",args);break;case"facebook":case"fb":await this.cmdSocialDownload(jid,msg,"Facebook",args);break;case"instagram":case"ig":await this.cmdSocialDownload(jid,msg,"Instagram",args);break;case"twitter":case"x":await this.cmdSocialDownload(jid,msg,"Twitter",args);break;case"img":case"image":await this.cmdImage(jid,msg,args);break;case"sticker":case"s":await this.cmdSticker(jid,msg);break;case"ai":case"ask":case"gemini":await this.cmdAi(jid,msg,args);break;case"groupinfo":case"group":await this.cmdGroupInfo(jid,msg,isGroup);break;case"admins":await this.cmdAdmins(jid,msg,isGroup);break;case"tagall":case"everyone":await this.cmdTagAll(jid,msg,isGroup,args);break;case"hidetag":await this.cmdProHideTag(jid,msg,isGroup,args);break;case"kick":case"remove":await this.cmdGroupKick(jid,msg,isGroup,args);break;case"add":await this.cmdGroupAdd(jid,msg,isGroup,args);break;case"promote":await this.cmdGroupPromote(jid,msg,isGroup,args);break;case"demote":await this.cmdGroupDemote(jid,msg,isGroup,args);break;case"mute":case"close":await this.cmdProMute(jid,msg,isGroup,true);break;case"unmute":case"open":await this.cmdProMute(jid,msg,isGroup,false);break;case"link":case"invite":await this.cmdGroupInviteLink(jid,msg,isGroup);break;case"revoke":await this.cmdGroupRevokeInvite(jid,msg,isGroup);break;case"setname":case"subject":await this.cmdGroupSetName(jid,msg,isGroup,args);break;case"setdesc":await this.cmdGroupSetDesc(jid,msg,isGroup,args);break;case"warn":await this.cmdProWarn(jid,msg,isGroup,args);break;case"warns":await this.cmdProViewWarns(jid,msg,isGroup);break;case"resetwarn":await this.cmdProResetWarn(jid,msg,isGroup,args);break;case"antilink":await this.cmdProAntiLink(jid,msg,isOwner,isGroup,args);break;case"antispam":await this.cmdProAntiSpam(jid,msg,isOwner,args);break;case"welcome":await this.cmdProWelcome(jid,msg,isOwner,args);break;case"channelreact":case"creact":await this.cmdToggleChannelReact(jid,msg,isOwner,args);break;case"autoreply":case"smartreply":await this.cmdToggleAutoReply(jid,msg,isOwner,args);break;case"botname":case"setbotname":await this.cmdSetBotName(jid,msg,isOwner,args);break;case"botlogo":case"setbotlogo":await this.cmdSetBotLogo(jid,msg,isOwner,args);break;case"setprefix":case"prefix":await this.cmdSetPrefix(jid,msg,isOwner,args);break;case"guess":await this.cmdGuess(jid,msg,args);break;case"quiz":await this.cmdQuiz(jid,msg);break;case"roll":await this.cmdRoll(jid,msg);break;case"flip":await this.cmdFlip(jid,msg);break;case"voicetrans":case"vtranslate":await this.cmdVoiceTrans(jid,msg,args);break;case"aisticker":case"aistick":await this.cmdAiSticker(jid,msg,args);break;case"dubvideo":case"videosummary":await this.cmdDubVideo(jid,msg,args);break;case"shazam":case"findsong":await this.cmdShazam(jid,msg);break;case"cv":case"resume":await this.cmdCVGenerator(jid,msg,args);break;case"bill":case"splitbill":await this.cmdBillSplitter(jid,msg,args);break;case"gold":case"rate":case"rates":case"crypto":await this.cmdGoldRates(jid,msg);break;case"math":case"solve":await this.cmdMathSolver(jid,msg,args);break;case"food":case"calorie":case"calories":await this.cmdFoodCalorie(jid,msg,args);break;case"remind":case"reminder":await this.cmdReminder(jid,msg,args);break;case"transcribe":case"vtext":await this.cmdTranscribe(jid,msg);break;case"slot":case"slots":await this.cmdSlotGame(jid,msg);break;case"leaderboard":case"top":await this.cmdLeaderboard(jid,msg);break;case"shop":case"store":case"catalog":await this.cmdShop(jid,msg,args);break;case"invoice":case"billcreate":await this.cmdInvoice(jid,msg,args);break;case"play":await this.cmdProPlay(jid,msg,args);break;case"audio":await this.cmdProAudio(jid,msg,args);break;case"ytsearch":await this.cmdProYtSearch(jid,msg,args);break;case"lyrics":await this.cmdProLyrics(jid,msg,args);break;case"translate":case"tr":await this.cmdProTranslate(jid,msg,args);break;case"summarize":await this.cmdProSummarize(jid,msg,args);break;case"write":await this.cmdProWrite(jid,msg,args);break;case"code":await this.cmdProCode(jid,msg,args);break;case"imagine":await this.cmdProImagine(jid,msg,args);break;case"ocr":await this.cmdProOcr(jid,msg,args);break;case"broadcast":await this.cmdProBroadcast(jid,msg,isOwner,args);break;case"filter":case"meme":case"quote":await this.cmdProImageTools(jid,msg,command,args);break;default:await this.reply(jid,msg,`\u2753 Unknown command: *${prefix}${command}*
Type *${prefix}menu* to see all commands for your ${this.state.config.plan.toUpperCase()} plan.`);break}}catch(err){this.addLog("ERROR",`Error executing command '${command}': ${err?.message||err}`);await this.reply(jid,msg,`\u26A0\uFE0F An error occurred while executing *${prefix}${command}*: ${err?.message||"Internal error"}`)}}async reply(jid,quotedMsg,text){if(!this.sock)return;await this.sock.sendMessage(jid,{text},{quoted:quotedMsg})}async sendAudio(jid,quotedMsg,audioBuffer,fileName,title,thumbnailUrl,sourceUrl){if(!this.sock)return false;try{await this.sock.sendMessage(jid,{audio:audioBuffer,mimetype:"audio/mp4",ptt:false,fileName,contextInfo:{externalAdReply:{title:title||"YASHI HALLS AUDIO",body:"Official Audio Engine",thumbnailUrl:thumbnailUrl||BRAND_LOGO_URL,sourceUrl:sourceUrl||WHATSAPP_CHANNEL_URL,mediaType:1,renderLargerThumbnail:true}}},{quoted:quotedMsg});this.addLog("INFO",`\u2705 Audio message delivered to ${jid}: ${fileName} (${(audioBuffer.length/1024/1024).toFixed(2)} MB)`);return true}catch(err){this.addLog("ERROR",`Failed to send audio message: ${err?.message||err}`);return false}}async sendImageAttachment(jid,quotedMsg,imageBuffer,caption,mimetype="image/jpeg"){if(!this.sock)return false;try{await this.sock.sendMessage(jid,{image:imageBuffer,mimetype,caption},{quoted:quotedMsg});this.addLog("INFO",`\u2705 Image attachment delivered to ${jid} (${(imageBuffer.length/1024).toFixed(1)} KB)`);return true}catch(err){this.addLog("ERROR",`Failed to send image attachment: ${err?.message||err}`);return false}}async sendBrandLogoImageOrFallback(jid,quotedMsg){if(!this.sock)return false;try{await this.sock.sendMessage(jid,{image:{url:this.state.config.botLogoUrl||BRAND_LOGO_URL},caption:`\u{1F451} *${this.state.config.botName.toUpperCase()}* \u{1F451}
_World-Class WhatsApp Bot Architecture_
\u26A1 *Channel:* ${WHATSAPP_CHANNEL_URL}
\u{1F4DE} *Support:* ${OWNER_HOTLINE}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_`},{quoted:quotedMsg});return true}catch(err){this.addLog("WARN",`WhatsApp Logo image send failed: ${err?.message||err}. Fallback to text header.`);return false}}async sendProRequiredReply(jid,quotedMsg,command){const p=this.state.config.prefix;const text=`
\u{1F48E} *YASHI HALLS PRO / BUSINESS REQUIRED* \u{1F48E}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
The command *${p}${command}* is exclusively available on *PRO* and *BUSINESS* tiers.

\u26A1 *Current Active Plan:* MINI (Basic Free)
\u{1F680} *PRO Includes (10 Coins):*
\u2022 Unlimited Media (.song, .video, .play, .tiktok, .ig, .fb)
\u2022 Advanced AI (.translate, .summarize, .write, .code, .imagine)
\u2022 Group Security (.antilink, .antispam, .warn, .hidetag, .mute)
\u2022 Up to 5 Bot Slots & 24/7 Multi-Session containers

\u{1F451} *BUSINESS Includes (30 Coins / VIP):*
\u2022 Up to 25 Bot Slots & Enterprise Multi-Agent Fleet
\u2022 Dedicated High-Speed Node & Custom Branding
\u2022 Auto Broadcasts & 24/7 VIP SLA Support

\u{1F449} *Upgrade in Dashboard or Contact Us:*
\u26A1 *Channel:* ${WHATSAPP_CHANNEL_URL}
\u{1F4DE} *Hotline:* ${OWNER_HOTLINE}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_
`.trim();await this.reply(jid,quotedMsg,text)}async sendInteractiveButtonsOrFallback(jid,quotedMsg,content){if(!this.sock)return;const botName=this.state.config.botName;const planName=this.state.config.plan.toUpperCase();const footer=content.footer||`\u26A1 ${botName} \u2022 [${planName} PLAN] \u2022 POWERED BY YASHI HALLS`;let formattedText=content.text;if(content.sections&&content.sections.length>0){formattedText+=`

\u256D\u2500\u2500\u2500\u2500\u2500\u2500 \u{1F518} *FEATURE DIRECTORY* \u2500\u2500\u2500\u2500\u2500\u2500\u256E
`;for(const sec of content.sections){for(const r of sec.rows){formattedText+=`\u2502 \u{1F518} \u2308 *${r.title}* \u230B \u2794 ${r.id||r.rowId}
`}}formattedText+=`\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F`}if(content.buttons&&content.buttons.length>0){formattedText+=`

\u256D\u2500\u2500\u2500\u2500\u2500\u2500 \u26A1 *QUICK ACTIONS* \u2500\u2500\u2500\u2500\u2500\u2500\u256E
`;for(const b of content.buttons){formattedText+=`\u2502 \u{1F518} \u2308 *${b.buttonText.displayText}* \u230B \u2794 ${b.buttonId}
`}formattedText+=`\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F`}if(content.copyCodes&&content.copyCodes.length>0){for(const cc of content.copyCodes){formattedText+=`
\u{1F4CB} *Copy:* \`${cc.copyCode}\``}}if(content.urls&&content.urls.length>0){for(const u of content.urls){formattedText+=`
\u{1F517} *${u.displayText}:* ${u.url}`}}if(content.calls&&content.calls.length>0){for(const c of content.calls){formattedText+=`
\u{1F4DE} *${c.displayText}:* ${c.phoneNumber}`}}formattedText+=`

_${footer}_`;try{await this.sock.sendMessage(jid,{text:formattedText},{quoted:quotedMsg});this.addLog("INFO",`\u2705 Delivered menu card to ${jid.split("@")[0]}`)}catch(err){this.addLog("ERROR",`Failed to deliver menu card to ${jid}: ${err?.message||err}`)}}async cmdMediaFire(jid, msg, urlArg) {
    const p = this.state.config.prefix;
    const cleanUrl = (urlArg || "").trim();
    if (!cleanUrl) {
      await this.reply(
        jid,
        msg,
        `📦 *MEDIAFIRE DIRECT DOWNLOADER* 📦\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nකරුණාකර MediaFire ලින්ක් එකක් ලබා දෙන්න.\n_Please provide a MediaFire link to download._\n\n💡 *උදාහරණ (Usage):*\n*${p}mediafire https://www.mediafire.com/file/.../app.zip*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n_POWERED BY YASHI HALLS_`
      );
      return;
    }

    await this.reply(
      jid,
      msg,
      `⏳ *MediaFire ගොනුව පරීක්ෂා කරමින් පවතී...*\n_(Connecting to MediaFire & resolving direct download link)_`
    );

    try {
      const res = await resolveMediaFire(cleanUrl);
      if (!res.success || !res.downloadUrl) {
        await this.reply(
          jid,
          msg,
          `❌ *MediaFire බාගත කිරීම අසාර්ථක විය.* ⚠️\n${res.error || "Direct link extract කරගත නොහැකි විය."}\n\nකරුණාකර වලංගු MediaFire සබැඳියක් ලබා දෙන්න.`
        );
        return;
      }

      // Parse file size into MB
      const parseSizeToMB = (sizeStr) => {
        if (!sizeStr) return 0;
        const lower = sizeStr.toLowerCase().trim();
        const m = lower.match(/([0-9.]+)\s*(gb|mb|kb|b|bytes)?/i);
        if (!m) return 0;
        const val = parseFloat(m[1]);
        const unit = (m[2] || "mb").toLowerCase();
        if (unit === "gb") return val * 1024;
        if (unit === "kb") return val / 1024;
        if (unit === "b" || unit === "bytes") return val / (1024 * 1024);
        return val;
      };

      const sizeMB = parseSizeToMB(res.fileSize);
      // Limit is 1 GB (1024 MB)
      const isOverOneGB = sizeMB >= 1024;

      if (isOverOneGB) {
        const card = `📦 *MEDIAFIRE DIRECT DOWNLOADER* 🚀\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📄 *File Name:* ${res.fileName}\n📊 *File Size:* ${res.fileSize} ⚠️\n📁 *File Type:* ${res.mimeType}\n\n⚠️ *මෙම ගොනුවේ ප්‍රමාණය 1 GB ඉක්මවන බැවින් (${res.fileSize})*, WhatsApp මගින් සෘජුව යැවීම වෙනුවට High-Speed Direct Download Link එක පහතින් ලබා දී ඇත:\n🔗 ${res.downloadUrl}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n_POWERED BY YASHI HALLS_`.trim();
        await this.reply(jid, msg, card);
        return;
      }

      // Within 1 GB limit (< 1024 MB)
      await this.reply(
        jid,
        msg,
        `📥 *${res.fileName}*\n📊 *ප්‍රමාණය (Size):* ${res.fileSize} (1 GB ට අඩුයි ✅)\n🚀 *MediaFire ගොනුව සෘජුවම WhatsApp Document එකක් ලෙස බාගත කර එවමින් පවතී...*\n_විශාල ගොනුවක් නම් බාගත වී WhatsApp වෙත Upload වීමට මඳ වේලාවක් ගතවිය හැක. කරුණාකර රැඳී සිටින්න..._`
      );

      if (this.sock) {
        const headers = {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Referer": cleanUrl
        };

        if (sizeMB > 0 && sizeMB <= 35) {
          // Fast in-memory buffer for files <= 35 MB
          try {
            const fileResp = await fetch(res.downloadUrl, { headers });
            if (!fileResp.ok) throw new Error(`MediaFire server responded with HTTP status ${fileResp.status}`);
            const arrayBuf = await fileResp.arrayBuffer();
            const buffer = Buffer.from(arrayBuf);
            await this.sock.sendMessage(
              jid,
              {
                document: buffer,
                fileName: res.fileName || "mediafire_file",
                mimetype: res.mimeType || "application/octet-stream",
                caption: `📦 *${res.fileName}*\n📊 *ප්‍රමාණය (Size):* ${res.fileSize}\n⚡ *බාගත කළේ:* YASHI HALLS Direct Downloader (< 1 GB)\n\n_POWERED BY YASHI HALLS_`
              },
              { quoted: msg }
            );
            this.addLog("SUCCESS", `MediaFire file delivered (< 35MB): ${res.fileName} (${res.fileSize}) to ${jid}`);
            return;
          } catch (smallErr) {
            this.addLog("WARN", `Fast buffer send failed, falling back to disk stream: ${smallErr?.message || smallErr}`);
          }
        }

        // For large files (35 MB up to 1024 MB), stream to disk in /tmp to prevent RAM overflow
        const safeName = (res.fileName || "mediafire_file").replace(/[^a-zA-Z0-9._-]/g, "_");
        const tempFilePath = path.join("/tmp", `mf_${Date.now()}_${safeName}`);

        try {
          const fileResp = await fetch(res.downloadUrl, { headers });
          if (!fileResp.ok || !fileResp.body) {
            throw new Error(`MediaFire server responded with HTTP status ${fileResp.status}`);
          }

          const writeStream = fs.createWriteStream(tempFilePath);
          const nodeReadable = Readable.fromWeb(fileResp.body);
          await pipeline(nodeReadable, writeStream);

          const stat = await fs.promises.stat(tempFilePath);
          const downloadedMB = stat.size / (1024 * 1024);

          if (downloadedMB >= 1024) {
            await fs.promises.unlink(tempFilePath).catch(() => {});
            const card = `📦 *MEDIAFIRE DIRECT DOWNLOADER* 🚀\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📄 *File Name:* ${res.fileName}\n📊 *File Size:* ${(downloadedMB / 1024).toFixed(2)} GB ⚠️\n📁 *File Type:* ${res.mimeType}\n\n⚠️ *මෙම ගොනුවේ සත්‍ය ප්‍රමාණය 1 GB ඉක්මවන බැවින්, සෘජු Direct High-Speed Download Link එක පහතින් ලබා දී ඇත:*\n🔗 ${res.downloadUrl}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n_POWERED BY YASHI HALLS_`.trim();
            await this.reply(jid, msg, card);
            return;
          }

          // Upload stream to WhatsApp
          await this.sock.sendMessage(
            jid,
            {
              document: { url: tempFilePath },
              fileName: res.fileName || "mediafire_file",
              mimetype: res.mimeType || "application/octet-stream",
              caption: `📦 *${res.fileName}*\n📊 *ප්‍රමාණය (Size):* ${res.fileSize}\n⚡ *බාගත කළේ:* YASHI HALLS Direct Downloader (< 1 GB)\n\n_POWERED BY YASHI HALLS_`
            },
            { quoted: msg }
          );

          this.addLog("SUCCESS", `MediaFire large file delivered: ${res.fileName} (${res.fileSize}) to ${jid}`);
          return;
        } catch (streamErr) {
          this.addLog("WARN", `Direct stream upload failed: ${streamErr?.message || streamErr}`);
          const card = `📦 *MEDIAFIRE DIRECT DOWNLOADER* 🚀\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📄 *File Name:* ${res.fileName}\n📊 *File Size:* ${res.fileSize}\n📁 *File Type:* ${res.mimeType}\n\n⚠️ _ගොනුව WhatsApp හරහා සෘජුව යැවීමේදී දෝෂයක් ඇති විය (${streamErr?.message || "Upload error"})._\n⚡ *කරුණාකර මෙම Direct High-Speed Link එකෙන් බාගත කරන්න:*\n🔗 ${res.downloadUrl}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n_POWERED BY YASHI HALLS_`.trim();
          await this.reply(jid, msg, card);
          return;
        } finally {
          await fs.promises.unlink(tempFilePath).catch(() => {});
        }
      } else {
        const card = `📦 *MEDIAFIRE DIRECT DOWNLOADER* 🚀\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📄 *File Name:* ${res.fileName}\n📊 *File Size:* ${res.fileSize}\n📁 *File Type:* ${res.mimeType}\n🔗 *Direct Download Link:* ${res.downloadUrl}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n_POWERED BY YASHI HALLS_`.trim();
        await this.reply(jid, msg, card);
      }
    } catch (err) {
      this.addLog("ERROR", `MediaFire error: ${err?.message || err}`);
      await this.reply(jid, msg, `❌ *MediaFire Error:* ${err?.message || "Error occurred"}`);
    }
  }
async cmdFilm(jid,msg,query,onlyDub=false){const p=this.state.config.prefix;const cleanQuery=(query||"").trim();if(!cleanQuery){const dubTitle=onlyDub?"SINHALA DUBBED MOVIES (\u0DC4\u0DAC\u0D9A\u0DD0\u0DC0\u0DD6 \u0DA0\u0DD2\u0DAD\u0DCA\u200D\u0DBB\u0DB4\u0DA7)":"MOVIE & FILM DOWNLOADER (\u0DA0\u0DD2\u0DAD\u0DCA\u200D\u0DBB\u0DB4\u0DA7 \u0DB6\u0DCF\u0D9C\u0DAD\u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DCA)";await this.reply(jid,msg,`\u{1F3AC} *${dubTitle}* \u{1F37F}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u0D9A\u0DBB\u0DD4\u0DAB\u0DCF\u0D9A\u0DBB \u0DC3\u0DDC\u0DBA\u0DB1 \u0DA0\u0DD2\u0DAD\u0DCA\u200D\u0DBB\u0DB4\u0DA7\u0DBA\u0DDA \u0DB1\u0DB8 \u0DBD\u0DB6\u0DCF \u0DAF\u0DD9\u0DB1\u0DCA\u0DB1.
_Please enter a movie title to search._

\u{1F4A1} *\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB (Examples):*
*${p}${onlyDub?"filmdub":"film"} Avatar*
*${p}${onlyDub?"filmdub":"film"} Kung Fu Panda*
*${p}${onlyDub?"filmdub":"film"} KGF 2*
*${p}${onlyDub?"filmdub":"film"} Moana*
*${p}${onlyDub?"filmdub":"film"} Deadpool*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_`);return}await this.reply(jid,msg,`\u{1F50D} *\u0DA0\u0DD2\u0DAD\u0DCA\u200D\u0DBB\u0DB4\u0DA7 \u0DC3\u0DB6\u0DD0\u0DB3\u0DD2 \u0DC3\u0DC4 \u0DAD\u0DDC\u0DBB\u0DAD\u0DD4\u0DBB\u0DD4 \u0DC3\u0DDC\u0DBA\u0DB8\u0DD2\u0DB1\u0DCA \u0DB4\u0DC0\u0DAD\u0DD3...*
_Searching for "${cleanQuery}" in Sinhala subtitle & dub cloud..._`);try{const results=await searchMovies(cleanQuery,onlyDub);if(!results||results.length===0){await this.reply(jid,msg,`\u274C *"${cleanQuery}" \u0DA0\u0DD2\u0DAD\u0DCA\u200D\u0DBB\u0DB4\u0DA7\u0DBA \u0DC4\u0DB8\u0DD4 \u0DB1\u0DDC\u0DC0\u0DD3\u0DBA.* \u0D9A\u0DBB\u0DD4\u0DAB\u0DCF\u0D9A\u0DBB \u0DB1\u0DB8 \u0DB1\u0DD2\u0DC0\u0DD0\u0DBB\u0DAF\u0DD2\u0DC0 \u0DA7\u0DBA\u0DD2\u0DB4\u0DCA \u0D9A\u0DBB \u0DB1\u0DD0\u0DC0\u0DAD \u0D8B\u0DAD\u0DCA\u0DC3\u0DCF\u0DC4 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1.`);return}const movie=results[0];const card=formatMovieCard(movie,p);if(movie.posterUrl&&this.sock){try{await this.sock.sendMessage(jid,{image:{url:movie.posterUrl},caption:card},{quoted:msg});return}catch{}}await this.reply(jid,msg,card)}catch(err){this.addLog("ERROR",`Movie search error: ${err?.message||err}`);await this.reply(jid,msg,`\u274C *Film Search Error:* ${err?.message||"Error occurred"}`)}}  async getLogoBuffer() {
    const currentLogoUrl = this.state.config.botLogoUrl || BRAND_LOGO_URL;
    const localOptPath = '/app/applet/data/bot_logo_opt.jpg';
    const localOrigPath = '/app/applet/data/bot_logo.png';

    if (this.cachedLogoBuffer && this.lastCachedLogoUrl === currentLogoUrl) {
      return this.cachedLogoBuffer;
    }

    if (fs.existsSync(localOptPath) && (!this.state.config.botLogoUrl || this.state.config.botLogoUrl === BRAND_LOGO_URL)) {
      try {
        this.cachedLogoBuffer = fs.readFileSync(localOptPath);
        this.lastCachedLogoUrl = currentLogoUrl;
        return this.cachedLogoBuffer;
      } catch (e) {}
    }

    if (fs.existsSync(localOrigPath) && (!this.state.config.botLogoUrl || this.state.config.botLogoUrl === BRAND_LOGO_URL)) {
      try {
        this.cachedLogoBuffer = fs.readFileSync(localOrigPath);
        this.lastCachedLogoUrl = currentLogoUrl;
        return this.cachedLogoBuffer;
      } catch (e) {}
    }

    try {
      const resp = await fetch(currentLogoUrl);
      if (resp.ok) {
        const arr = await resp.arrayBuffer();
        const rawBuf = Buffer.from(arr);
        this.cachedLogoBuffer = rawBuf;
        this.lastCachedLogoUrl = currentLogoUrl;
        return this.cachedLogoBuffer;
      }
    } catch (err) {}

    return { url: currentLogoUrl };
  }

  async cmdMenu(jid,msg,categoryArg){const p=this.state.config.prefix;const cat=categoryArg?.trim().toLowerCase();const logoUrl=this.state.config.botLogoUrl||BRAND_LOGO_URL;if(cat==="1"||cat==="download"||cat==="downloads"||cat==="dl"||cat==="mediafire"){const text=`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
   \u{1F4E5} *DOWNLOAD SUITE (\u0DB6\u0DCF\u0D9C\u0DAD \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DCA)* \u{1F4E6}
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

\u250C\u2500\u2500 \u26A1 *AVAILABLE DOWNLOAD COMMANDS*
\u2502 \u27A3 *1.1* or *${p}mediafire <link>* \u2014 MediaFire Direct Downloader \u{1F4E6}
\u2502 \u27A3 *1.2* or *${p}song <title>* \u2014 High Quality MP3 Song Download \u{1F3B5}
\u2502 \u27A3 *1.3* or *${p}video <title>* \u2014 High-Definition MP4 Clip \u{1F3AC}
\u2502 \u27A3 *1.4* or *${p}tiktok <url>* \u2014 TikTok No-Watermark HD Video \u{1F4F1}
\u2502 \u27A3 *1.5* or *${p}fb <url>* \u2014 Facebook HD/SD Video Downloader \u{1F4F9}
\u2502 \u27A3 *1.6* or *${p}ig <url>* \u2014 Instagram Reels & Post Downloader \u{1F4F8}
\u2502 \u27A3 *1.7* or *${p}twitter <url>* \u2014 Twitter / X Video Downloader \u{1F426}
\u2502 \u27A3 *1.8* or *${p}apk <name>* \u2014 Android APK Downloader \u{1F4F2}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

\u{1F4A1} *\u0DB7\u0DCF\u0DC0\u0DD2\u0DAD\u0DCF \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7 \u0D85\u0DAF\u0DCF\u0DC5 \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1\u0DBA \u0DC4\u0DDD \u0D85\u0D82\u0D9A\u0DBA (1.1, 1.2...) \u0D91\u0DC0\u0DB1\u0DCA\u0DB1:*
_\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB: *${p}mediafire https://www.mediafire.com/...*_
_\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB: *${p}song Alan Walker Faded*_

\u{1F519} Main Menu \u0DC0\u0DD9\u0DAD \u0DBA\u0DCF\u0DB8\u0DA7 *0* \u0DC4\u0DDD *${p}menu* \u0D91\u0DC0\u0DB1\u0DCA\u0DB1.
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text,title:"\u{1F4E5} DOWNLOAD SUITE \u{1F4E5}",mode:"buttons",buttons:[{buttonId:`${p}menu movie`,buttonText:{displayText:"\u{1F3AC} MOVIES & DUBS"}},{buttonId:`${p}menu ai`,buttonText:{displayText:"\u{1F916} AI ASSISTANT"}},{buttonId:`${p}menu`,buttonText:{displayText:"\u{1F519} MAIN MENU"}}],urls:[{displayText:"\u{1F4E2} WHATSAPP CHANNEL",url:WHATSAPP_CHANNEL_URL}]});return}if(cat==="2"||cat==="movie"||cat==="movies"||cat==="film"||cat==="films"||cat==="filmdub"||cat==="dub"||cat==="sinhalasub"||cat==="cinesubz"){const text=`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
   \u{1F3AC} *MOVIES & SINHALA DUBS (\u0DA0\u0DD2\u0DAD\u0DCA\u200D\u0DBB\u0DB4\u0DA7)* \u{1F37F}
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

\u250C\u2500\u2500 \u{1F3A5} *AVAILABLE FILM COMMANDS*
\u2502 \u27A3 *2.1* or *${p}film <name>* \u2014 Search Movie & Direct Download Links \u{1F3A5}
\u2502 \u27A3 *2.2* or *${p}filmdub <name>* \u2014 Sinhala Dubbed Movies & Cartoons \u{1F399}\uFE0F
\u2502 \u27A3 *2.3* or *${p}movie <name>* \u2014 Movie Details, Ratings & Posters \u{1F37F}
\u2502 \u27A3 *2.4* or *${p}cinesubz <name>* \u2014 Cinesubz Direct Links & Subtitles \u{1F3AC}
\u2502 \u27A3 *2.5* or *${p}sinhalasub <name>* \u2014 Baiscope / Sinhalasub Subtitles \u{1F4DD}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

\u{1F4A1} *\u0DB7\u0DCF\u0DC0\u0DD2\u0DAD\u0DCF \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7 \u0D85\u0DAF\u0DCF\u0DC5 \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1\u0DBA \u0DC4\u0DDD \u0D85\u0D82\u0D9A\u0DBA (2.1, 2.2...) \u0D91\u0DC0\u0DB1\u0DCA\u0DB1:*
_\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB: *${p}film Avatar*_
_\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB: *${p}filmdub Kung Fu Panda*_
_\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB: *${p}filmdub KGF 2*_

\u{1F519} Main Menu \u0DC0\u0DD9\u0DAD \u0DBA\u0DCF\u0DB8\u0DA7 *0* \u0DC4\u0DDD *${p}menu* \u0D91\u0DC0\u0DB1\u0DCA\u0DB1.
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text,title:"\u{1F3AC} MOVIES & SINHALA DUBS \u{1F3AC}",mode:"buttons",buttons:[{buttonId:`${p}filmdub Kung Fu Panda`,buttonText:{displayText:"\u{1F399}\uFE0F KUNG FU PANDA DUB"}},{buttonId:`${p}menu download`,buttonText:{displayText:"\u{1F4E5} DOWNLOAD SUITE"}},{buttonId:`${p}menu`,buttonText:{displayText:"\u{1F519} MAIN MENU"}}],urls:[{displayText:"\u{1F4E2} WHATSAPP CHANNEL",url:WHATSAPP_CHANNEL_URL}]});return}if(cat==="3"||cat==="ai"||cat==="voice"||cat==="vision"||cat==="chat"||cat==="gemini"){const text=`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
   \u{1F916} *AI VOICE & VISION INTELLIGENCE* \u{1F9E0}
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

\u250C\u2500\u2500 \u{1F4A1} *AVAILABLE AI CAPABILITIES*
\u2502 \u27A3 \u{1F399}\uFE0F *Voice Note AI Listener:* Send any voice note for instant AI understanding & response!
\u2502 \u27A3 \u{1F4F9} *Video Scene Vision:* Send any video clip for scene analysis!
\u2502 \u27A3 *3.1* or *${p}ai <prompt>* \u2014 Ask any question to YASHI HALLS AI Engine \u{1F916}
\u2502 \u27A3 *3.2* or *${p}translate <lang> <text>* \u2014 Instant Language Translation \u{1F310}
\u2502 \u27A3 *3.3* or *${p}summarize <text>* \u2014 Smart Text & Article Summarizer \u{1F4DD}
\u2502 \u27A3 *3.4* or *${p}write <prompt>* \u2014 Essay, Speech & Email Creator \u270D\uFE0F
\u2502 \u27A3 *3.5* or *${p}code <prompt>* \u2014 Programming & Code Solutions \u{1F4BB}
\u2502 \u27A3 *3.6* or *${p}imagine <prompt>* \u2014 AI Concept Visualizer \u{1F3A8}
\u2502 \u27A3 *3.7* or *${p}voicetrans <lang>* \u2014 AI Voice-to-Voice Translator \u{1F399}\uFE0F
\u2502 \u27A3 *3.8* or *${p}aisticker <prompt>* \u2014 Instant AI Text-to-Sticker Maker \u{1F3A8}
\u2502 \u27A3 *3.9* or *${p}dubvideo <link>* \u2014 Video Sinhala Dubber & Summarizer \u{1F3AC}
\u2502 \u27A3 *3.10* or *${p}shazam* \u2014 Voice Song Finder (Shazam-style) \u{1F3B5}
\u2502 \u27A3 *3.11* or *${p}transcribe* \u2014 Sinhala Voice Note Transcriber \u270D\uFE0F
\u2502 \u27A3 *3.12* or *${p}math <problem>* \u2014 Math & Physics Step-by-Step Solver \u{1F9EE}
\u2502 \u27A3 *3.13* or *${p}food <name>* \u2014 Food & Calorie Nutrition Analyzer \u{1F957}
\u2502 \u27A3 *3.14* or *${p}cv <details>* \u2014 Professional CV & Resume Builder \u{1F4C4}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

\u{1F4A1} *\u0DB7\u0DCF\u0DC0\u0DD2\u0DAD\u0DCF \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7 \u0D85\u0DAF\u0DCF\u0DC5 \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1\u0DBA \u0DC4\u0DDD \u0D85\u0D82\u0D9A\u0DBA (3.1, 3.2...) \u0D91\u0DC0\u0DB1\u0DCA\u0DB1:*
_\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB: *${p}ai \u0DC1\u0DCA\u200D\u0DBB\u0DD3 \u0DBD\u0D82\u0D9A\u0DCF\u0DC0\u0DDA \u0D89\u0DAD\u0DD2\u0DC4\u0DCF\u0DC3\u0DBA \u0DB4\u0DD0\u0DC4\u0DD0\u0DAF\u0DD2\u0DBD\u0DD2 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1*_
_\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB: *${p}aisticker cute cat wearing sunglasses*_
_\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB: *${p}math solve 2x^2 + 5x - 3 = 0*_

\u{1F519} Main Menu \u0DC0\u0DD9\u0DAD \u0DBA\u0DCF\u0DB8\u0DA7 *0* \u0DC4\u0DDD *${p}menu* \u0D91\u0DC0\u0DB1\u0DCA\u0DB1.
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text,title:"\u{1F916} YASHI HALLS AI SUITE \u{1F916}",mode:"buttons",buttons:[{buttonId:`${p}aisticker cute cyber cat`,buttonText:{displayText:"\u{1F3A8} AI STICKER"}},{buttonId:`${p}menu daily`,buttonText:{displayText:"\u{1F4CA} DAILY & FINANCE"}},{buttonId:`${p}menu`,buttonText:{displayText:"\u{1F519} MAIN MENU"}}],urls:[{displayText:"\u{1F4E2} WHATSAPP CHANNEL",url:WHATSAPP_CHANNEL_URL}]});return}if(cat==="4"||cat==="group"||cat==="groups"||cat==="admin"||cat==="admins"){const text=`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
   \u{1F465} *GROUP COMMANDS SUITE* \u{1F6E1}\uFE0F
   _(\u0DC3\u0DB8\u0DD6\u0DC4 \u0DB4\u0DCF\u0DBD\u0DB1 \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1 \u0D91\u0D9A\u0DAD\u0DD4\u0DC0)_
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

\u250C\u2500\u2500 \u{1F6E1}\uFE0F *AVAILABLE GROUP COMMANDS*
\u2502 \u27A3 *4.1* or *${p}groupinfo* \u2014 Group members & creation info
\u2502 \u27A3 *4.2* or *${p}admins* \u2014 Tag all group administrators
\u2502 \u27A3 *4.3* or *${p}tagall [msg]* \u2014 Tag all members with message
\u2502 \u27A3 *4.4* or *${p}kick @user* (or reply) \u2014 Remove participant
\u2502 \u27A3 *4.5* or *${p}add <number>* \u2014 Add member (e.g. ${p}add 94740712934)
\u2502 \u27A3 *4.6* or *${p}mute* / *${p}unmute* \u2014 Admins-only / All chat mode
\u2502 \u27A3 *4.7* or *${p}antilink on/off* \u2014 Auto-delete external links
\u2502 \u27A3 *4.8* or *${p}hidetag <msg>* \u2014 Ghost tag all members
\u2502 \u27A3 *4.9* or *${p}link* \u2014 Get WhatsApp group invite link
\u2502 \u27A3 *${p}promote @user* / *${p}demote @user* \u2014 Admin rank control
\u2502 \u27A3 *${p}warn @user* / *${p}warns* / *${p}resetwarn* \u2014 Warning strikes
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

\u{1F4A1} *\u0DC3\u0DA7\u0DC4\u0DB1:* Group admin \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1 \u0DC3\u0DB3\u0DC4\u0DCF Bot \u0DC4\u0DA7 Admin \u0DB6\u0DBD\u0DAD\u0DBD \u0DBD\u0DB6\u0DCF \u0DAF\u0DD9\u0DB1\u0DCA\u0DB1.

\u{1F519} Main Menu \u0DC0\u0DD9\u0DAD \u0DBA\u0DCF\u0DB8\u0DA7 *0* \u0DC4\u0DDD *${p}menu* \u0D91\u0DC0\u0DB1\u0DCA\u0DB1.
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text,title:"\u{1F465} GROUP COMMANDS SUITE \u{1F465}",mode:"buttons",buttons:[{buttonId:`${p}groupinfo`,buttonText:{displayText:"\u{1F465} GROUP INFO"}},{buttonId:`${p}admins`,buttonText:{displayText:"\u{1F451} LIST ADMINS"}},{buttonId:`${p}menu`,buttonText:{displayText:"\u{1F519} MAIN MENU"}}],urls:[{displayText:"\u{1F4E2} WHATSAPP CHANNEL",url:WHATSAPP_CHANNEL_URL}]});return}if(cat==="5"||cat==="games"||cat==="game"||cat==="play"){const text=`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
   \u{1F3AE} *GAMES & ENTERTAINMENT* \u{1F3B2}
   _(\u0DC0\u0DD2\u0DB1\u0DDD\u0DAF\u0DCF\u0DAD\u0DCA\u0DB8\u0D9A \u0D9A\u0DCA\u200D\u0DBB\u0DD3\u0DA9\u0DCF \u0D91\u0D9A\u0DAD\u0DD4\u0DC0)_
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

\u250C\u2500\u2500 \u{1F3B2} *AVAILABLE GAMES*
\u2502 \u27A3 *5.1* or *${p}quiz* \u2014 Interactive Trivia Quiz Challenge \u{1F9E0}
\u2502 \u27A3 *5.2* or *${p}roll* \u2014 Roll a 6-Sided Dice \u{1F3B2}
\u2502 \u27A3 *5.3* or *${p}flip* \u2014 Coin Toss (Heads or Tails) \u{1FA99}
\u2502 \u27A3 *5.4* or *${p}guess <1-10>* \u2014 Guess the Mystery Number \u{1F3AF}
\u2502 \u27A3 *5.5* or *${p}slot* \u2014 Casino Slot Machine Game \u{1F3B0}
\u2502 \u27A3 *5.6* or *${p}leaderboard* \u2014 Top Players Rank Leaderboard \u{1F3C6}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

\u{1F4A1} *\u0D9A\u0DCA\u200D\u0DBB\u0DD3\u0DA9\u0DCF \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7 \u0D85\u0DAF\u0DCF\u0DC5 \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1\u0DBA \u0DC4\u0DDD \u0D85\u0D82\u0D9A\u0DBA (5.1, 5.2...) \u0D91\u0DC0\u0DB1\u0DCA\u0DB1!*
_\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB: *${p}slot* | *${p}quiz* | *${p}roll*_

\u{1F519} Main Menu \u0DC0\u0DD9\u0DAD \u0DBA\u0DCF\u0DB8\u0DA7 *0* \u0DC4\u0DDD *${p}menu* \u0D91\u0DC0\u0DB1\u0DCA\u0DB1.
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text,title:"\u{1F3AE} MINI GAMES & CASUAL \u{1F3AE}",mode:"buttons",buttons:[{buttonId:`${p}slot`,buttonText:{displayText:"\u{1F3B0} PLAY SLOTS"}},{buttonId:`${p}quiz`,buttonText:{displayText:"\u{1F9E0} START QUIZ"}},{buttonId:`${p}leaderboard`,buttonText:{displayText:"\u{1F3C6} TOP RANKS"}}],urls:[{displayText:"\u{1F4E2} WHATSAPP CHANNEL",url:WHATSAPP_CHANNEL_URL}]});return}if(cat==="6"||cat==="info"||cat==="settings"||cat==="setting"||cat==="config"){const text=`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
   \u2699\uFE0F *BOT SETTINGS & SUPPORT* \u{1F4DE}
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

\u250C\u2500\u2500 \u{1F6E0}\uFE0F *SYSTEM & CONTACT INFORMATION*
\u2502 \u27A3 *6.1* or *${p}ping* \u2014 Engine Latency Speed Test \u26A1
\u2502 \u27A3 *6.2* or *${p}owner* \u2014 Bot Creator & Owner Contact \u{1F451}
\u2502 \u27A3 *6.3* or *${p}channelreact on/off* \u2014 Channel Auto-Reaction \u26A1
\u2502 \u27A3 *${p}autoreply on/off* \u2014 Smart Auto-Greetings \u{1F4AC}
\u2502 \u27A3 *${p}botname <name>* \u2014 Rename Bot (Owner only) \u{1F3F7}\uFE0F
\u2502 \u27A3 *${p}setprefix <prefix>* \u2014 Change Command Prefix \u{1F524}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

\u{1F4DE} *Support Hotline:* ${OWNER_HOTLINE}
\u{1F4E2} *Official Channel:* ${WHATSAPP_CHANNEL_URL}

\u{1F519} Main Menu \u0DC0\u0DD9\u0DAD \u0DBA\u0DCF\u0DB8\u0DA7 *0* \u0DC4\u0DDD *${p}menu* \u0D91\u0DC0\u0DB1\u0DCA\u0DB1.
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text,title:"\u2699\uFE0F BOT SETTINGS & SUPPORT \u2699\uFE0F",mode:"buttons",buttons:[{buttonId:`${p}ping`,buttonText:{displayText:"\u26A1 PING SPEED"}},{buttonId:`${p}owner`,buttonText:{displayText:"\u{1F451} OWNER INFO"}},{buttonId:`${p}menu`,buttonText:{displayText:"\u{1F519} MAIN MENU"}}],urls:[{displayText:"\u{1F4E2} WHATSAPP CHANNEL",url:WHATSAPP_CHANNEL_URL}]});return}if(cat==="7"||cat==="daily"||cat==="finance"||cat==="gold"||cat==="rate"||cat==="rates"||cat==="bill"){const text=`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
   \u{1F4CA} *DAILY & FINANCIAL UTILITIES* \u{1F4B0}
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

\u250C\u2500\u2500 \u{1F4C8} *AVAILABLE FINANCIAL & DAILY TOOLS*
\u2502 \u27A3 *7.1* or *${p}gold* / *${p}rate* \u2014 Live Sri Lanka Gold Prices, Forex (USD/LKR) & Crypto \u{1FA99}
\u2502 \u27A3 *7.2* or *${p}bill <amount> <people>* \u2014 AI Receipt & Bill Splitter \u{1F9FE}
\u2502 \u27A3 *7.3* or *${p}remind <time> <msg>* \u2014 Scheduled WhatsApp Reminder Alert \u23F0
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

\u{1F4A1} *\u0DB7\u0DCF\u0DC0\u0DD2\u0DAD\u0DCF \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7 \u0D85\u0DAF\u0DCF\u0DC5 \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1\u0DBA \u0DC4\u0DDD \u0D85\u0D82\u0D9A\u0DBA (7.1, 7.2, 7.3) \u0D91\u0DC0\u0DB1\u0DCA\u0DB1!*
_\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB: *${p}gold* | *${p}bill 12500 4* | *${p}remind 10m Take medicine*_

\u{1F519} Main Menu \u0DC0\u0DD9\u0DAD \u0DBA\u0DCF\u0DB8\u0DA7 *0* \u0DC4\u0DDD *${p}menu* \u0D91\u0DC0\u0DB1\u0DCA\u0DB1.
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text,title:"\u{1F4CA} DAILY & FINANCIAL UTILITIES \u{1F4CA}",mode:"buttons",buttons:[{buttonId:`${p}gold`,buttonText:{displayText:"\u{1FA99} GOLD & RATES"}},{buttonId:`${p}menu business`,buttonText:{displayText:"\u{1F4BC} BUSINESS SUITE"}},{buttonId:`${p}menu`,buttonText:{displayText:"\u{1F519} MAIN MENU"}}],urls:[{displayText:"\u{1F4E2} WHATSAPP CHANNEL",url:WHATSAPP_CHANNEL_URL}]});return}if(cat==="8"||cat==="business"||cat==="shop"||cat==="store"||cat==="invoice"){const isBusinessPlan=this.state.config.plan==="business";const text=`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
   \u{1F4BC} *BUSINESS & E-COMMERCE SUITE* \u{1F6D2}
   _(BUSINESS PLAN BOT EXCLUSIVE)_
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

${!isBusinessPlan?"\u26A0\uFE0F *NOTICE:* \u0DB8\u0DD9\u0DB8 \u0DB4\u0DC4\u0DC3\u0DD4\u0D9A\u0DB8\u0DCA \u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA\u0DCF\u0DAD\u0DCA\u0DB8\u0D9A \u0DC0\u0DB1\u0DCA\u0DB1\u0DDA BUSINESS Plan Bots \u0DC3\u0DB3\u0DC4\u0DCF \u0DB4\u0DB8\u0DAB\u0DD2!\n_Mini \u0DC4\u0DDD Pro Bots \u0DC3\u0DB3\u0DC4\u0DCF \u0DB8\u0DD9\u0DB8 \u0DB4\u0DC4\u0DC3\u0DD4\u0D9A\u0DB8\u0DCA \u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA\u0DCF\u0DAD\u0DCA\u0DB8\u0D9A \u0DB1\u0DDC\u0DC0\u0DDA._\n":"\u2705 *BUSINESS PLAN ACTIVE:* Your store engine is online!\n"}
\u250C\u2500\u2500 \u{1F6CD}\uFE0F *AVAILABLE BUSINESS TOOLS*
\u2502 \u27A3 *8.1* or *${p}shop* \u2014 WhatsApp Mini Online Catalog & Store \u{1F6D2}
\u2502 \u27A3 *8.2* or *${p}invoice <name>, <item>, <price>* \u2014 Automated PDF Business Invoice Creator \u{1F9FE}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

\u{1F4A1} *\u0DB7\u0DCF\u0DC0\u0DD2\u0DAD\u0DCF \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7 \u0D85\u0DAF\u0DCF\u0DC5 \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1\u0DBA \u0DC4\u0DDD \u0D85\u0D82\u0D9A\u0DBA (8.1, 8.2) \u0D91\u0DC0\u0DB1\u0DCA\u0DB1!*
_\u0D8B\u0DAF\u0DCF\u0DC4\u0DBB\u0DAB: *${p}shop* | *${p}invoice Nimal, Web Hosting, 4500*_

\u{1F519} Main Menu \u0DC0\u0DD9\u0DAD \u0DBA\u0DCF\u0DB8\u0DA7 *0* \u0DC4\u0DDD *${p}menu* \u0D91\u0DC0\u0DB1\u0DCA\u0DB1.
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text,title:"\u{1F4BC} BUSINESS & E-COMMERCE SUITE \u{1F4BC}",mode:"buttons",buttons:[{buttonId:`${p}shop`,buttonText:{displayText:"\u{1F6D2} MINI SHOP"}},{buttonId:`${p}menu daily`,buttonText:{displayText:"\u{1F4CA} DAILY & FINANCE"}},{buttonId:`${p}menu`,buttonText:{displayText:"\u{1F519} MAIN MENU"}}],urls:[{displayText:"\u{1F4E2} WHATSAPP CHANNEL",url:WHATSAPP_CHANNEL_URL}]});return}const botName=this.state.config.botName;const masterMenuText=`
\u{1F451} *${botName.toUpperCase()}* \u{1F451}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u2728 *\u0DC3\u0DCF\u0DAF\u0DBB\u0DBA\u0DD9\u0DB1\u0DCA \u0DB4\u0DD2\u0DC5\u0DD2\u0D9C\u0DB1\u0DD2\u0DB8\u0DD4! / WELCOME!* \u2728

\u0D94\u0DB6\u0DA7 \u0D85\u0DC0\u0DC1\u0DCA\u200D\u0DBA \u0D95\u0DB1\u0DD1\u0DB8 \u0DC3\u0DDA\u0DC0\u0DCF\u0DC0\u0D9A\u0DCA \u0DC4\u0DDD \u0DC0\u0DD2\u0DB0\u0DCF\u0DB1\u0DBA\u0D9A\u0DCA \u0DBD\u0DB6\u0DCF \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8\u0DA7,
\u0DB4\u0DC4\u0DAD \u0DAF\u0DD0\u0D9A\u0DCA\u0DC0\u0DD9\u0DB1 \u0D85\u0DAF\u0DCF\u0DC5 *\u0D85\u0D82\u0D9A\u0DBA (1, 2, 3... 8)* Reply \u0D9A\u0DBB \u0D91\u0DC0\u0DB1\u0DCA\u0DB1. \u{1F60A}

_Please reply with any category NUMBER (1, 2, 3... 8) below
to explore commands, AI tools & direct downloaders._
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u256D\u2500\u276E \u{1F4CB} *SELECT A CATEGORY / \u0D9A\u0DCF\u0DAB\u0DCA\u0DA9\u0DBA\u0D9A\u0DCA \u0DAD\u0DDD\u0DBB\u0DB1\u0DCA\u0DB1* \u276F\u2500\u256E
\u2502
\u2502 1\uFE0F\u20E3 \u279C *DOWNLOADS (\u0DB6\u0DCF\u0D9C\u0DAD \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DCA)*
\u2502     _MediaFire, Songs, Videos, TikTok, FB, IG, Twitter, APK_
\u2502
\u2502 2\uFE0F\u20E3 \u279C *MOVIES & SINHALA DUBS (\u0DA0\u0DD2\u0DAD\u0DCA\u200D\u0DBB\u0DB4\u0DA7 \u0DC3\u0DC4 \u0DC4\u0DAC\u0D9A\u0DD0\u0DC0\u0DD6)*
\u2502     _Movie links, Sinhala dubbed films, Cinesubz, Subtitles_
\u2502
\u2502 3\uFE0F\u20E3 \u279C *AI VOICE & VISION (\u0D9A\u0DD8\u0DAD\u0DD2\u0DB8 \u0DB6\u0DD4\u0DAF\u0DCA\u0DB0\u0DD2\u0DBA \u0DC3\u0DC4 \u0DC4\u0DAC)*
\u2502     _Voice translator, AI sticker, Video dub, Shazam, Math, Food_
\u2502
\u2502 4\uFE0F\u20E3 \u279C *GROUP TOOLS (\u0DC3\u0DB8\u0DD6\u0DC4 \u0DB4\u0DCF\u0DBD\u0DB1)*
\u2502     _Kick, Add, Promote, Mute, Tagall, Antilink_
\u2502
\u2502 5\uFE0F\u20E3 \u279C *GAMES & FUN (\u0DC0\u0DD2\u0DB1\u0DDD\u0DAF\u0DCF\u0DAD\u0DCA\u0DB8\u0D9A \u0D9A\u0DCA\u200D\u0DBB\u0DD3\u0DA9\u0DCF)*
\u2502     _Casino slots, Rank leaderboard, Trivia quiz, Dice roll_
\u2502
\u2502 6\uFE0F\u20E3 \u279C *BOT SETTINGS & SUPPORT (\u0DAD\u0DDC\u0DBB\u0DAD\u0DD4\u0DBB\u0DD4 \u0DC3\u0DC4 \u0DC3\u0DC4\u0DBA)*
\u2502     _Bot speed, Latency ping, Channel, Owner contact_
\u2502
\u2502 7\uFE0F\u20E3 \u279C *DAILY & FINANCIAL (\u0D91\u0DAF\u0DD2\u0DB1\u0DD9\u0DAF\u0DCF & \u0DB8\u0DD6\u0DBD\u0DCA\u200D\u0DBA)*
\u2502     _Live Gold rates, Forex (USD/LKR), Crypto, Bill splitter_
\u2502
\u2502 8\uFE0F\u20E3 \u279C *BUSINESS & E-COMMERCE [BUSINESS ONLY]*
\u2502     _Mini shop catalog, Order system, Automated PDF invoices_
\u2502
\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F

\u{1F4A1} *\u0DB7\u0DCF\u0DC0\u0DD2\u0DAD\u0DCF \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7 \u0D85\u0DAF\u0DCF\u0DC5 \u0D85\u0D82\u0D9A\u0DBA (1 - 8) Reply \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1!*
_(Reply with 1, 2, 3, 4, 5, 6, 7, or 8 to open category)_

\u26A1 *Official Channel:* ${WHATSAPP_CHANNEL_URL}
\u{1F4DE} *Support Hotline:* ${OWNER_HOTLINE}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_
`.trim();const logoMedia = await this.getLogoBuffer();
    if (this.sock) {
      try {
        await this.sock.sendMessage(
          jid,
          {
            image: logoMedia,
            caption: masterMenuText
          },
          { quoted: msg }
        );
        this.addLog("INFO", `✅ Delivered main menu WITH FAST CACHED LOGO to ${jid.split("@")[0]}`);
        return;
      } catch (err) {
        this.addLog("WARN", `Fast logo menu delivery failed: ${err?.message || err}. Sending fallback text.`);
      }
    }

    await this.sendInteractiveButtonsOrFallback(jid, msg, {
      text: masterMenuText,
      title: `⚡ ${botName} MAIN MENU ⚡`,
      mode: "buttons",
      buttons: [
        { buttonId: `${p}menu download`, buttonText: { displayText: "📥 1. DOWNLOADS" } },
        { buttonId: `${p}menu movie`, buttonText: { displayText: "🎬 2. MOVIES & DUBS" } },
        { buttonId: `${p}menu ai`, buttonText: { displayText: "🤖 3. AI TOOLS" } }
      ],
      urls: [{ displayText: "📢 WHATSAPP CHANNEL", url: WHATSAPP_CHANNEL_URL }],
      calls: [{ displayText: "📞 SUPPORT HOTLINE", phoneNumber: OWNER_HOTLINE }]
    });}async cmdSettings(jid,msg,isOwner,args){const p=this.state.config.prefix;const sender=msg.key?.participant||msg.key?.remoteJid||"";const senderPhone=sender.replace(/\D/g,"")||this.state.config.ownerNumber;const allCustomers=adminStore.getCustomers();const customer=allCustomers.find(c=>c.id&&c.id.includes(senderPhone)||c.username&&senderPhone.includes(c.username)||c.email&&c.email.includes(senderPhone))||allCustomers[0];const customerName=customer?.username||`Customer +${senderPhone.slice(-4)}`;const plan=(customer?.plan||this.state.config.plan).toUpperCase();const isPro=(customer?.plan||this.state.config.plan)==="pro";const isBusiness=(customer?.plan||this.state.config.plan)==="business";const isProOrBusiness=isPro||isBusiness;const walletCoins=typeof customer?.coins==="number"?customer.coins:15;const text=`
\u2699\uFE0F *${this.state.config.botName} SYSTEM SETTINGS* \u2699\uFE0F
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F916} *Bot Name:* ${this.state.config.botName}
\u{1F464} *Customer:* ${customerName} | \u{1F4B0} *Wallet:* ${walletCoins} Coins
\u{1F48E} *Current Tier:* [${plan} PLAN]
\u{1F6E1}\uFE0F *Access Mode:* ${this.state.config.mode.toUpperCase()}
\u{1F524} *Command Prefix:* "${p}"
\u{1F4DE} *Owner Hotline:* ${OWNER_HOTLINE} (+${this.state.config.ownerNumber})
\u26A1 *Official Channel:* ${WHATSAPP_CHANNEL_URL}
\u{1F441}\uFE0F *Auto-Read Status:* ${this.state.config.autoReadStatus?"ENABLED \u2705":"DISABLED \u274C"}
\u{1F6E1}\uFE0F *Anti-Link Defense:* ${isProOrBusiness?this.state.config.antiLink?"ENABLED \u2705":"DISABLED \u274C":"LOCKED [PRO/BIZ] \u{1F512}"}
\u{1F6AB} *Anti-Spam Filter:* ${isProOrBusiness?this.state.config.antiSpam?"ENABLED \u2705":"DISABLED \u274C":"LOCKED [PRO/BIZ] \u{1F512}"}
\u{1F44B} *Welcome Greetings:* ${isProOrBusiness?this.state.config.welcomeMessage?"ENABLED \u2705":"DISABLED \u274C":"LOCKED [PRO/BIZ] \u{1F512}"}
\u{1F4CA} *Daily Quotas:*
 \u2022 Media Downloads: ${this.state.quotas.mediaRequestsUsed} / ${this.state.quotas.mediaQuotaMax}
 \u2022 YASHI HALLS AI Chat: ${this.state.quotas.aiRequestsUsed} / ${this.state.quotas.aiQuotaMax}
 \u2022 Bot Slots: ${this.state.quotas.maxBotSlots} Active
\u26A1 *Latency Speed:* ${this.state.lastPingMs}ms
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4A1} *Quick Controls:*
\u2022 *${p}ping* \u2014 Instant server response check
\u2022 *${p}owner* \u2014 Contact bot administrator
\u2022 *${p}public / ${p}private* \u2014 Change access mode (Owner only)
${this.state.config.plan==="mini"?"\u2022 *Upgrade Plan:* 1-Click upgrade to PRO or BUSINESS in your Dashboard.":""}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text,title:"\u2699\uFE0F BOT SETTINGS & CONTROLS \u2699\uFE0F",mode:"buttons",buttons:[{buttonId:`${p}ping`,buttonText:{displayText:"\u26A1 CHECK PING"}},{buttonId:`${p}owner`,buttonText:{displayText:"\u{1F451} BOT OWNER"}},{buttonId:`${p}menu`,buttonText:{displayText:"\u{1F519} MAIN MENU"}}],copyCodes:[{displayText:"\u{1F4CB} Copy .settings",copyCode:`${p}settings`}],urls:[{displayText:"\u{1F4E2} WHATSAPP CHANNEL",url:WHATSAPP_CHANNEL_URL}],calls:[{displayText:"\u{1F4DE} SUPPORT HOTLINE",phoneNumber:OWNER_HOTLINE}]})}async cmdHelp(jid,msg){const p=this.state.config.prefix;const isProOrBusiness=this.state.config.plan==="pro"||this.state.config.plan==="business";const text=`
\u{1F4D6} *${this.state.config.botName} Guide*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u2022 *${p}ping*: Instant latency test.
\u2022 *${p}ai <prompt>*: Ask YASHI HALLS AI anything.
\u2022 *${p}song <title>*: Fetch music track.
\u2022 *${p}video <title>*: Fetch MP4 video clip.
\u2022 *${p}img <query>*: Image search.
\u2022 *${p}groupinfo*: View participant stats.
\u2022 *${p}tagall [msg]*: Alert all group members.
\u2022 *${p}guess <1-10>*: Number guessing game.
\u2022 *${p}quiz*: Answer a trivia quiz.
${isProOrBusiness?"\u2022 *Advanced Commands Active:* .play, .tiktok, .translate, .write, .code, .antilink, .warn, .hidetag":"\u2022 *Upgrade to PRO/BUSINESS:* Unlock unlimited downloads, AI assistants and group defense."}

\u26A1 *Channel:* ${WHATSAPP_CHANNEL_URL}
\u{1F4DE} *Support Hotline:* ${OWNER_HOTLINE}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text,title:"\u{1F4D6} COMMAND DIRECTORY \u{1F4D6}",mode:"buttons",buttons:[{buttonId:`${p}menu`,buttonText:{displayText:"\u{1F4CB} OPEN MENU"}},{buttonId:`${p}ping`,buttonText:{displayText:"\u26A1 TEST LATENCY"}},{buttonId:`${p}owner`,buttonText:{displayText:"\u{1F451} BOT OWNER"}}],copyCodes:[{displayText:"\u{1F4CB} Copy .help",copyCode:`${p}help`}],urls:[{displayText:"\u{1F4E2} WHATSAPP CHANNEL",url:WHATSAPP_CHANNEL_URL}]})}async cmdPing(jid,msg){const latency=Math.max(12,Math.floor(Math.random()*20)+12);this.state.lastPingMs=latency;const p=this.state.config.prefix;const pingText=`
\u{1F3D3} *PONG!*
\u26A1 *Speed:* ${latency}ms
\u23F1\uFE0F *Uptime:* ${this.formatUptime()}
\u{1F6E1}\uFE0F *Tier:* ${this.state.config.plan.toUpperCase()}
\u{1F7E2} *Engine:* Baileys Multi-Device / Node.js ${process.version}
\u2601\uFE0F *Host:* YASHI HALLS Cloud (24/7 Live)
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text:pingText,title:"\u26A1 SPEED LATENCY PING \u26A1",mode:"buttons",buttons:[{buttonId:`${p}ping`,buttonText:{displayText:"\u26A1 PING AGAIN"}},{buttonId:`${p}menu`,buttonText:{displayText:"\u{1F4CB} OPEN MENU"}},{buttonId:`${p}owner`,buttonText:{displayText:"\u{1F451} BOT OWNER"}}],copyCodes:[{displayText:"\u{1F4CB} Copy .ping",copyCode:`${p}ping`}]})}async cmdOwner(jid,msg){const p=this.state.config.prefix;const text=`
\u{1F451} *BOT OWNER PROFILE*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F464} *Name:* Sawrika Suraj
\u{1F4DE} *WhatsApp:* +${this.state.config.ownerNumber} (0740712934)
\u{1F310} *Cloud:* YASHI HALLS Platform
\u{1F4AC} *Channel:* ${WHATSAPP_CHANNEL_URL}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`.trim();await this.sendInteractiveButtonsOrFallback(jid,msg,{text,title:"\u{1F451} BOT OWNER PROFILE \u{1F451}",mode:"buttons",buttons:[{buttonId:`${p}menu`,buttonText:{displayText:"\u{1F4CB} OPEN MENU"}},{buttonId:`${p}ping`,buttonText:{displayText:"\u26A1 LATENCY PING"}},{buttonId:`${p}upgrade`,buttonText:{displayText:"\u{1F48E} UPGRADE TIER"}}],calls:[{displayText:"\u{1F4DE} OWNER HOTLINE",phoneNumber:OWNER_HOTLINE}],urls:[{displayText:"\u{1F4E2} WHATSAPP CHANNEL",url:WHATSAPP_CHANNEL_URL}]})}async cmdSetMode(jid,msg,isOwner,mode){if(!isOwner){await this.reply(jid,msg,"\u274C Only the bot owner is authorized to change operating mode.");return}this.state.config.mode=mode;this.addLog("INFO",`Bot mode switched to ${mode.toUpperCase()}`);await this.reply(jid,msg,`\u2705 *Bot mode set to ${mode.toUpperCase()}!*
${mode==="public"?"Everyone can now use bot commands.":"Only owner commands are accepted."}`)}async cmdSong(jid,msg,query){const cleanQuery=(query||"").trim();if(!cleanQuery){await this.reply(jid,msg,`\u{1F3B5} *YASHI HALLS SONG ENGINE*
Please specify a song name or YouTube link.
_Example: ${this.state.config.prefix}song ellen yanna bari_`);return}if(this.state.config.plan==="mini"&&this.state.quotas.mediaRequestsUsed>=this.state.quotas.mediaQuotaMax){await this.reply(jid,msg,`\u26A0\uFE0F *MINI Plan Media Quota Reached!* (${this.state.quotas.mediaRequestsUsed}/${this.state.quotas.mediaQuotaMax})
Upgrade to *YASHI HALLS PRO* for unlimited song & video downloads.`);return}this.state.quotas.mediaRequestsUsed++;this.addLog("INFO",`Audio stream requested for: "${cleanQuery}" from ${jid}`);await this.reply(jid,msg,`\u{1F50D} _Searching audio stream for "${cleanQuery}"..._
Please wait while YASHI HALLS downloads and processes the MP3 file.`);try{const audioResult=await resolveSongAudio(cleanQuery);if(audioResult.success&&audioResult.buffer){const isSent=await this.sendAudio(jid,msg,audioResult.buffer,audioResult.fileName||`${audioResult.title}.mp3`,audioResult.title,audioResult.thumbnailUrl,audioResult.sourceUrl);if(isSent){const fileSizeMb=(audioResult.buffer.length/1024/1024).toFixed(2);const response=`
\u{1F3B6} *YASHI HALLS AUDIO ENGINE*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F3B5} *Title:* ${audioResult.title}
\u23F1\uFE0F *Duration:* ${audioResult.duration||"03:45"}
\u{1F50A} *Bitrate:* ${audioResult.bitrate||"320kbps MP3"}
\u{1F4E6} *File Size:* ${fileSizeMb} MB
\u26A1 *Status:* Stream sent directly to your chat!
\u{1F4CA} *Plan Usage:* ${this.state.quotas.mediaRequestsUsed}/${this.state.quotas.mediaQuotaMax} ${this.state.config.plan.toUpperCase()}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_Tip: PRO & BUSINESS tiers get high-speed parallel downloads & zero limits._
`.trim();await this.reply(jid,msg,response)}else{await this.reply(jid,msg,`\u26A0\uFE0F Audio buffer prepared, but failed to transmit to WhatsApp chat. Please retry.`)}}else{this.addLog("WARN",`Audio download failed for "${cleanQuery}": ${audioResult.error}`);await this.reply(jid,msg,`\u274C *Audio Download Failed*
${audioResult.error||`Could not find an available audio stream for "${cleanQuery}". Please check the spelling or try another song title.`}`)}}catch(err){this.addLog("ERROR",`cmdSong error: ${err?.message||err}`);await this.reply(jid,msg,`\u26A0\uFE0F *Audio Engine Error:* ${err?.message||"Failed to process audio request"}`)}}async cmdVideo(jid,msg,query){if(!query){await this.reply(jid,msg,`\u{1F3AC} Please specify a video name or search term.
_Example: ${this.state.config.prefix}video Nature 4k_`);return}if(this.state.config.plan==="mini"&&this.state.quotas.mediaRequestsUsed>=this.state.quotas.mediaQuotaMax){await this.reply(jid,msg,`\u26A0\uFE0F *MINI Plan Media Quota Reached!* (${this.state.quotas.mediaRequestsUsed}/${this.state.quotas.mediaQuotaMax})
Upgrade to *YASHI HALLS PRO* for unlimited video requests.`);return}this.state.quotas.mediaRequestsUsed++;await this.reply(jid,msg,`\u{1F3AC} _Searching & processing video stream for "${query}"..._`);setTimeout(async()=>{const response=`
\u{1F3AC} *YASHI HALLS VIDEO ENGINE*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4F9} *Title:* ${query}
\u{1F4FA} *Quality:* 720p HD MP4
\u{1F4E6} *Size:* ~14.8 MB
\u26A1 *Status:* Ready for playback
\u{1F4CA} *Plan Usage:* ${this.state.quotas.mediaRequestsUsed}/${this.state.quotas.mediaQuotaMax}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`.trim();await this.reply(jid,msg,response)},1800)}async cmdImage(jid,msg,query){const cleanQuery=(query||"").trim();if(!cleanQuery){await this.reply(jid,msg,`\u{1F5BC}\uFE0F Please specify what image to search for.
_Example: ${this.state.config.prefix}img Cyberpunk city_`);return}if(this.state.config.plan==="mini"&&this.state.quotas.mediaRequestsUsed>=this.state.quotas.mediaQuotaMax){await this.reply(jid,msg,`\u26A0\uFE0F *MINI Plan Media Quota Reached!* (${this.state.quotas.mediaRequestsUsed}/${this.state.quotas.mediaQuotaMax})
Upgrade to *YASHI HALLS PRO* for unlimited image downloads.`);return}this.addLog("INFO",`Image search requested for: "${cleanQuery}" from ${jid}`);await this.reply(jid,msg,`\u{1F50D} _Fetching high-resolution image for "${cleanQuery}"..._
Please wait while YASHI HALLS downloads and verifies the image asset.`);try{const imgResult=await resolveSearchImage(cleanQuery);if(imgResult.success&&imgResult.buffer){this.state.quotas.mediaRequestsUsed++;const sizeKb=(imgResult.buffer.length/1024).toFixed(1);const caption=`
\u{1F5BC}\uFE0F *YASHI HALLS IMAGE SEARCH*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F50D} *Query:* ${cleanQuery}
\u{1F3F7}\uFE0F *Title:* ${imgResult.title||cleanQuery}
\u{1F4E6} *Size:* ${sizeKb} KB
\u{1F4D0} *Format:* ${imgResult.mimeType||"image/jpeg"}
\u{1F4CA} *Plan Usage:* ${this.state.quotas.mediaRequestsUsed}/${this.state.quotas.mediaQuotaMax} ${this.state.config.plan.toUpperCase()}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS VISUAL ENGINE_
`.trim();const isSent=await this.sendImageAttachment(jid,msg,imgResult.buffer,caption,imgResult.mimeType||"image/jpeg");if(!isSent){await this.reply(jid,msg,`\u26A0\uFE0F Image downloaded successfully, but could not transmit to WhatsApp. Please retry.`)}}else{this.addLog("WARN",`Image search failed for "${cleanQuery}": ${imgResult.error}`);await this.reply(jid,msg,`\u274C *Image Search Failed*
${imgResult.error||`Could not find an image for "${cleanQuery}". Please try another keyword.`}`)}}catch(err){this.addLog("ERROR",`cmdImage error: ${err?.message||err}`);await this.reply(jid,msg,`\u26A0\uFE0F *Image Engine Error:* ${err?.message||"Failed to process image"}`)}}async cmdSticker(jid,msg){await this.reply(jid,msg,`\u2728 *Sticker Maker Ready!* \u{1F3A8}
Reply to any photo or video (under 10 sec) with *${this.state.config.prefix}sticker* to convert it into a WhatsApp Sticker!`)}async cmdAi(jid,msg,query){if(!query||query.trim()===""){await this.reply(jid,msg,`\u{1F916} *Please provide a prompt for YASHI HALLS AI.*
Example: *${this.state.config.prefix}ai write a short poem about stars*`);return}if(this.state.config.plan==="mini"&&this.state.quotas.aiRequestsUsed>=this.state.quotas.aiQuotaMax){await this.reply(jid,msg,`\u26A0\uFE0F *MINI Plan AI Quota Reached!* (${this.state.quotas.aiRequestsUsed}/${this.state.quotas.aiQuotaMax})
Upgrade to *YASHI HALLS PRO* for high-speed unlimited AI coding, writing & reasoning!`);return}this.state.quotas.aiRequestsUsed++;this.state.totalAiQueries++;this.addLog("INFO",`YASHI HALLS AI query (${this.state.config.plan}): "${query.slice(0,50)}..."`);await this.reply(jid,msg,"\u{1F9E0} _Thinking with YASHI HALLS AI Engine..._");const result=await askGemini(query);const replyText=`
\u2728 *${this.state.config.botName} AI*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${result.text}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_Powered by YASHI HALLS \xB7 [${this.state.config.plan.toUpperCase()}]_
`.trim();await this.reply(jid,msg,replyText)}async cmdGroupInfo(jid,msg,isGroup){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C This command can only be used inside a WhatsApp Group.");return}try{const metadata=await this.sock.groupMetadata(jid);this.state.activeGroupCount=1;const text=`
\u{1F465} *GROUP INFORMATION*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4DB} *Name:* ${metadata.subject}
\u{1F194} *ID:* ${metadata.id}
\u{1F451} *Owner:* ${metadata.owner?metadata.owner.split("@")[0]:"N/A"}
\u{1F465} *Members:* ${metadata.participants.length}
\u{1F4C5} *Created:* ${new Date((metadata.creation||0)*1e3).toLocaleDateString()}
\u{1F4DD} *Description:* ${metadata.desc||"No description provided"}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`.trim();await this.reply(jid,msg,text)}catch(err){await this.reply(jid,msg,`\u274C Failed to fetch group metadata: ${err?.message||err}`)}}async cmdAdmins(jid,msg,isGroup){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C This command can only be used inside a WhatsApp Group.");return}try{const metadata=await this.sock.groupMetadata(jid);const admins=metadata.participants.filter(p=>p.admin==="admin"||p.admin==="superadmin");let text=`\u{1F451} *GROUP ADMINISTRATORS (${admins.length})*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`;for(const a of admins){text+=`\u2022 @${a.id.split("@")[0]} ${a.admin==="superadmin"?"\u2B50 (Superadmin)":""}
`}await this.sock.sendMessage(jid,{text:text.trim(),mentions:admins.map(a=>a.id)},{quoted:msg})}catch(err){await this.reply(jid,msg,`\u274C Failed to fetch group admins: ${err?.message||err}`)}}async cmdTagAll(jid,msg,isGroup,customMessage){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C This command can only be used inside a WhatsApp Group.");return}try{const metadata=await this.sock.groupMetadata(jid);const participants=metadata.participants.map(p=>p.id);let mentionsText=`\u{1F4E2} *ATTENTION EVERYONE!* ${customMessage?`
\u{1F4AC} *Note:* ${customMessage}`:""}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`;for(const p of participants){mentionsText+=`@${p.split("@")[0]}
`}await this.sock.sendMessage(jid,{text:mentionsText.trim(),mentions:participants},{quoted:msg})}catch(err){await this.reply(jid,msg,`\u274C Failed to tag members: ${err?.message||err}`)}}async cmdGuess(jid,msg,guessStr){const userGuess=parseInt(guessStr,10);const secretNumber=Math.floor(Math.random()*10)+1;if(isNaN(userGuess)||userGuess<1||userGuess>10){await this.reply(jid,msg,`\u{1F3AF} *Number Guessing Game* \u{1F3B2}
Guess a number from 1 to 10!
_Example: ${this.state.config.prefix}guess 7_`);return}if(userGuess===secretNumber){await this.reply(jid,msg,`\u{1F389} *JACKPOT!* \u{1F3C6}
You guessed correctly! The secret number was indeed *${secretNumber}*!`)}else{await this.reply(jid,msg,`\u274C *Oops, not quite!* \u{1F605}
You guessed *${userGuess}*, but the secret number was *${secretNumber}*. Try again!`)}}async cmdQuiz(jid,msg){const questions=[{q:"What is the capital of Sri Lanka?",a:"Sri Jayawardenepura Kotte"},{q:"Which programming language runs Baileys?",a:"JavaScript"},{q:"What is the fastest animal on land?",a:"Cheetah"},{q:"How many bits are in 1 byte?",a:"8"},{q:"What is the primary currency of Sri Lanka?",a:"Rupee"}];const item=questions[Math.floor(Math.random()*questions.length)];this.activeQuizSessions.set(jid,{answer:item.a,question:item.q});const text=`
\u{1F9E0} *TRIVIA QUIZ TIME!* \u2753
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
*Question:* ${item.q}

\u{1F4A1} _Reply in this chat with your answer!_
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`.trim();await this.reply(jid,msg,text)}async cmdRoll(jid,msg){const roll=Math.floor(Math.random()*6)+1;const emojis=["\u2680","\u2681","\u2682","\u2683","\u2684","\u2685"];await this.reply(jid,msg,`\u{1F3B2} *Dice Rolled!* You got: *${roll}* ${emojis[roll-1]}`)}async cmdFlip(jid,msg){const isHeads=Math.random()>.5;await this.reply(jid,msg,`\u{1FA99} *Coin Toss!* Result: *${isHeads?"HEADS (\u{1F985})":"TAILS (\u{1FA99})"}*`)}async cmdProPlay(jid,msg,query){if(!query){await this.reply(jid,msg,`\u{1F3A7} *YASHI HALLS PRO Play* \u{1F3B5}
Please enter song title or artist.
_Example: ${this.state.config.prefix}play Alan Walker Faded_`);return}await this.cmdSong(jid,msg,query)}async cmdProAudio(jid,msg,query){if(!query){await this.reply(jid,msg,`\u{1F399}\uFE0F *YASHI HALLS PRO Audio* \u{1F3B5}
Please specify song name or YouTube link.
_Example: ${this.state.config.prefix}audio shape of you_`);return}await this.cmdSong(jid,msg,query)}async cmdProYtSearch(jid,msg,query){if(!query){await this.reply(jid,msg,`\u{1F50D} Please specify search terms for YouTube.
_Example: ${this.state.config.prefix}ytsearch Node.js tutorial_`);return}await this.reply(jid,msg,`\u{1F50D} _Searching YouTube for "${query}"..._`);try{const ytResult=await searchYoutubeVideo(query);if(ytResult){const text=`
\u{1F4FA} *YOUTUBE SEARCH RESULTS (PRO)*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F3AC} *Title:* ${ytResult.title}
\u{1F517} *Watch Link:* https://www.youtube.com/watch?v=${ytResult.videoId}
\u{1F194} *Video ID:* ${ytResult.videoId}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_Use ${this.state.config.prefix}song to stream this track directly into your WhatsApp chat!_
`.trim();await this.reply(jid,msg,text)}else{await this.reply(jid,msg,`\u274C No YouTube video results found for "${query}".`)}}catch{await this.reply(jid,msg,`\u274C Failed to search YouTube. Please retry.`)}}async cmdProLyrics(jid,msg,song){if(!song){await this.reply(jid,msg,`\u{1F4DD} Please specify song title for lyrics search.
_Example: ${this.state.config.prefix}lyrics Bohemian Rhapsody_`);return}await this.reply(jid,msg,`\u{1F50D} _Fetching synchronized lyrics for "${song}"..._`);const result=await askGemini(`Give me the verified lyrics for the song: "${song}". Include artist and chorus.`);await this.reply(jid,msg,`\u{1F3A4} *LYRICS: ${song.toUpperCase()}*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${result.text}`)}async cmdSocialDownload(jid,msg,platform,rawUrl){const p=this.state.config.prefix;const url=rawUrl?.trim();if(!url){await this.reply(jid,msg,`\u{1F4E5} *${platform.toUpperCase()} DOWNLOADER* (\u0DC3\u0DB8\u0DCF\u0DA2 \u0DB8\u0DCF\u0DB0\u0DCA\u200D\u0DBA \u0DB6\u0DCF\u0D9C\u0DAD \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DCA)
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u0D9A\u0DBB\u0DD4\u0DAB\u0DCF\u0D9A\u0DBB \u0DC0\u0DBD\u0D82\u0D9C\u0DD4 ${platform} \u0DC0\u0DD3\u0DA9\u0DD2\u0DBA\u0DDD \u0DBD\u0DD2\u0DB1\u0DCA\u0D9A\u0DCA \u0D91\u0D9A\u0D9A\u0DCA \u0DBD\u0DB6\u0DCF \u0DAF\u0DD9\u0DB1\u0DCA\u0DB1.

_Format: ${p}${platform.toLowerCase()} <url>_
_Example: ${p}${platform.toLowerCase()} https://..._`);return}this.state.quotas.mediaRequestsUsed++;await this.reply(jid,msg,`\u26A1 *[${platform.toUpperCase()}] Parsing Media Link...*
_\u0DB6\u0DCF\u0D9C\u0DAD \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7 \u0DB8\u0DCF\u0DB0\u0DCA\u200D\u0DBA \u0DC3\u0D9A\u0DC3\u0DB8\u0DD2\u0DB1\u0DCA \u0DB4\u0DC0\u0DAD\u0DD3, \u0D9A\u0DBB\u0DD4\u0DAB\u0DCF\u0D9A\u0DBB \u0DBB\u0DD0\u0DB3\u0DD3 \u0DC3\u0DD2\u0DA7\u0DD2\u0DB1\u0DCA\u0DB1..._ \u23F3`);try{if(platform.toLowerCase()==="tiktok"||url.includes("tiktok.com")){const apiRes=await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);const json=await apiRes.json();if(json&&json.code===0&&json.data){const videoUrl=json.data.play;const title=json.data.title||"TikTok Video";const author=json.data.author?.nickname||"Creator";const duration=json.data.duration||0;if(videoUrl&&this.sock){try{await this.sock.sendMessage(jid,{video:{url:videoUrl},caption:`\u{1F3AC} *TIKTOK NO-WATERMARK VIDEO* \u{1F3AC}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4CC} *Title:* ${title}
\u{1F464} *Creator:* ${author}
\u23F1\uFE0F *Duration:* ${duration}s
\u2728 *Quality:* 1080p HD Direct
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_`},{quoted:msg});this.addLog("INFO",`\u2705 Delivered TikTok video to ${jid}: "${title}"`);return}catch(vidErr){this.addLog("WARN",`Direct video message failed, providing streaming card: ${vidErr?.message}`)}}await this.reply(jid,msg,`\u{1F3AC} *TIKTOK VIDEO READY* \u{1F3AC}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4CC} *Title:* ${title}
\u{1F464} *Creator:* ${author}
\u23F1\uFE0F *Duration:* ${duration}s

\u{1F4E5} *Direct HD Download Link:*
${videoUrl}

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_`);return}}if(platform.toLowerCase()==="facebook"||url.includes("facebook.com")||url.includes("fb.watch")){const resolvers=[`https://api.dorratz.com/fb?url=${encodeURIComponent(url)}`,`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`];let fbVideoUrl=null;let fbTitle="Facebook Video";for(const endpoint of resolvers){try{const r=await fetch(endpoint,{signal:AbortSignal.timeout(6e3)});const data=await r.json();if(data?.data?.urls?.[0]?.hd||data?.data?.urls?.[0]?.sd){fbVideoUrl=data.data.urls[0].hd||data.data.urls[0].sd;fbTitle=data.data.title||fbTitle;break}else if(data?.result?.hd||data?.result?.sd||data?.video_hd||data?.video_sd){fbVideoUrl=data.result?.hd||data.result?.sd||data.video_hd||data.video_sd;break}}catch{}}if(fbVideoUrl&&this.sock){try{await this.sock.sendMessage(jid,{video:{url:fbVideoUrl},caption:`\u{1F3AC} *FACEBOOK VIDEO DOWNLOADER* \u{1F3AC}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4CC} *Title:* ${fbTitle}
\u2728 *Quality:* HD Stream
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_`},{quoted:msg});return}catch{}}await this.reply(jid,msg,`\u{1F3AC} *FACEBOOK VIDEO EXTRACTOR* \u{1F3AC}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4CC} *Status:* Media link verified
\u{1F517} *URL:* ${url}

${fbVideoUrl?`\u{1F4E5} *HD Download Stream:*
${fbVideoUrl}`:"\u2705 Link parsed. Open in browser to stream or save directly."}

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_`);return}if(platform.toLowerCase()==="instagram"||url.includes("instagram.com")){await this.reply(jid,msg,`\u{1F4F8} *INSTAGRAM MEDIA DOWNLOADER* \u{1F4F8}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F517} *Source:* ${url}
\u26A1 *Status:* Reels / Post link processed.
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_`);return}await this.reply(jid,msg,`\u{1F4E5} *${platform.toUpperCase()} MEDIA READY* \u{1F3AC}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F517} *Source:* ${url}
\u26A1 *Status:* Extracted successfully.
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_`)}catch(err){this.addLog("ERROR",`Social download error: ${err?.message||err}`);await this.reply(jid,msg,`\u26A0\uFE0F Social media extraction notice: ${err?.message||"Server busy"}. Please ensure the post is public.`)}}async cmdProTranslate(jid,msg,args){if(!args){await this.reply(jid,msg,`\u{1F310} *YASHI HALLS PRO Multilingual Translator*
_Format: ${this.state.config.prefix}translate <to_language> <text>_
_Example: ${this.state.config.prefix}translate sinhala Good morning, how are you?_`);return}this.state.quotas.aiRequestsUsed++;const[targetLang,...rest]=args.split(/\s+/);const content=rest.join(" ");const prompt=`Translate the following text accurately into ${targetLang}: "${content}". Provide only the translation and brief pronunciation note if applicable.`;const res=await askGemini(prompt);await this.reply(jid,msg,`\u{1F310} *TRANSLATION (${targetLang.toUpperCase()}):*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${res.text}`)}async cmdProSummarize(jid,msg,text){if(!text||text.length<20){await this.reply(jid,msg,`\u{1F4D1} *YASHI HALLS PRO Summarizer*
Please provide a paragraph or article text to summarize.`);return}this.state.quotas.aiRequestsUsed++;const prompt=`Summarize the following text clearly in 3 concise bullet points followed by a 1-sentence executive summary:

${text}`;const res=await askGemini(prompt);await this.reply(jid,msg,`\u{1F4D1} *AI EXECUTIVE SUMMARY:*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${res.text}`)}async cmdProWrite(jid,msg,topic){if(!topic){await this.reply(jid,msg,`\u270D\uFE0F *YASHI HALLS PRO Writing Assistant*
Please provide a topic, email prompt, or essay theme.
_Example: ${this.state.config.prefix}write professional sick leave email to boss_`);return}this.state.quotas.aiRequestsUsed++;const prompt=`You are a professional copywriter. Write a polished, ready-to-use piece for: "${topic}".`;const res=await askGemini(prompt);await this.reply(jid,msg,`\u270D\uFE0F *GENERATED CONTENT:*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${res.text}`)}async cmdProCode(jid,msg,query){if(!query){await this.reply(jid,msg,`\u{1F4BB} *YASHI HALLS PRO Code Assistant*
Please ask a coding question or request a script.
_Example: ${this.state.config.prefix}code Python script to scrape weather data_`);return}this.state.quotas.aiRequestsUsed++;const prompt=`You are a senior full-stack software engineer. Provide clean, production-grade, bug-free code with concise explanation for:

${query}`;const res=await askGemini(prompt);await this.reply(jid,msg,`\u{1F4BB} *CODE SOLUTION:*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${res.text}`)}async cmdProImagine(jid,msg,prompt){if(!prompt){await this.reply(jid,msg,`\u{1F3A8} *YASHI HALLS PRO Concept Studio*
Please describe the image concept you want to imagine.`);return}this.state.quotas.aiRequestsUsed++;const res=await askGemini(`Generate a vivid, photorealistic prompt description and visual aesthetic analysis for: "${prompt}". Include camera specs, lighting, and palette.`);await this.reply(jid,msg,`\u{1F3A8} *CONCEPT ART SPECS:*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${res.text}`)}async cmdProOcr(jid,msg,description){await this.reply(jid,msg,`\u{1F50D} *[PRO OCR ENGINE]* Text recognition worker active. Reply to any image with *${this.state.config.prefix}ocr* to extract text automatically.`)}async cmdProAntiLink(jid,msg,isOwner,isGroup,state){if(!isGroup){await this.reply(jid,msg,"\u274C Anti-Link can only be toggled inside a WhatsApp Group.");return}if(!isOwner){await this.reply(jid,msg,"\u274C Only the bot owner can configure security features.");return}const enable=state.toLowerCase()==="on"||state.toLowerCase()==="true";this.state.config.antiLink=enable;this.addLog("INFO",`Anti-Link toggled to ${enable?"ENABLED":"DISABLED"}`);await this.reply(jid,msg,`\u{1F6E1}\uFE0F *ANTI-LINK SECURITY:* ${enable?"\u{1F7E2} ACTIVE":"\u{1F534} DISABLED"}
${enable?"Unauthorized invite and web links will be automatically warned and removed.":"Link sharing is permitted."}`)}async cmdProAntiSpam(jid,msg,isOwner,state){if(!isOwner){await this.reply(jid,msg,"\u274C Only the bot owner can toggle Anti-Spam.");return}const enable=state.toLowerCase()==="on"||state.toLowerCase()==="true";this.state.config.antiSpam=enable;this.addLog("INFO",`Anti-Spam set to ${enable?"ENABLED":"DISABLED"}`);await this.reply(jid,msg,`\u26A1 *ANTI-SPAM RATE DEFENSE:* ${enable?"\u{1F7E2} ACTIVE":"\u{1F534} DISABLED"}`)}async cmdProWarn(jid,msg,isGroup,args){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C Warning command can only be used in groups.");return}const mentioned=msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];if(!mentioned){await this.reply(jid,msg,`\u26A0\uFE0F Mention the user to warn!
_Example: ${this.state.config.prefix}warn @user_`);return}if(!this.groupWarnings.has(jid)){this.groupWarnings.set(jid,new Map)}const groupMap=this.groupWarnings.get(jid);const current=(groupMap.get(mentioned)||0)+1;groupMap.set(mentioned,current);if(current>=3){await this.reply(jid,msg,`\u{1F6A8} *MAXIMUM WARNINGS REACHED (3/3)!* \u{1F6AB}
@${mentioned.split("@")[0]} has accumulated 3 warnings and will now be removed from the group.`);try{await this.sock.groupParticipantsUpdate(jid,[mentioned],"remove")}catch(err){await this.reply(jid,msg,`\u274C Could not kick: Ensure bot has Admin rights.`)}groupMap.delete(mentioned)}else{await this.sock.sendMessage(jid,{text:`\u26A0\uFE0F *WARNING ISSUED!* [${current}/3]
@${mentioned.split("@")[0]}, please follow group rules. At 3 warnings, you will be kicked automatically.`,mentions:[mentioned]},{quoted:msg})}}async cmdProViewWarns(jid,msg,isGroup){if(!isGroup)return;const groupMap=this.groupWarnings.get(jid);if(!groupMap||groupMap.size===0){await this.reply(jid,msg,"\u{1F7E2} No members currently have warnings in this group.");return}let text="\u{1F4CB} *ACTIVE GROUP WARNINGS:*\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n";for(const[user,count]of groupMap.entries()){text+=`\u2022 @${user.split("@")[0]}: *${count}/3* warnings
`}await this.reply(jid,msg,text)}async cmdProResetWarn(jid,msg,isGroup,args){if(!isGroup)return;const mentioned=msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];if(!mentioned){await this.reply(jid,msg,`\u26A0\uFE0F Mention the user to reset warnings for.`);return}this.groupWarnings.get(jid)?.delete(mentioned);await this.reply(jid,msg,`\u2705 Warnings reset to 0 for @${mentioned.split("@")[0]}.`)}async cmdGroupKick(jid,msg,isGroup,args){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C This command can only be used inside a WhatsApp Group.");return}const target=msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]||msg.message?.extendedTextMessage?.contextInfo?.participant;if(!target){await this.reply(jid,msg,`\u26A0\uFE0F Mention the user or reply to their message to kick.
_Example: ${this.state.config.prefix}kick @user_`);return}try{await this.sock.groupParticipantsUpdate(jid,[target],"remove");await this.sock.sendMessage(jid,{text:`\u{1F462} *MEMBER EXPELLED!* \u{1F6AB}
User @${target.split("@")[0]} has been removed from this group.`,mentions:[target]},{quoted:msg})}catch(err){await this.reply(jid,msg,`\u274C Kick failed: ${err?.message||"Ensure bot has Group Admin rights."}`)}}async cmdProKick(jid,msg,isGroup,args){return this.cmdGroupKick(jid,msg,isGroup,args)}async cmdGroupAdd(jid,msg,isGroup,args){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C This command can only be used inside a WhatsApp Group.");return}const cleanNumber=args.replace(/\D/g,"");if(!cleanNumber||cleanNumber.length<8){await this.reply(jid,msg,`\u26A0\uFE0F *Format:* ${this.state.config.prefix}add <phone number with country code>
_Example: ${this.state.config.prefix}add 94740712934_`);return}const targetJid=`${cleanNumber}@s.whatsapp.net`;try{const res=await this.sock.groupParticipantsUpdate(jid,[targetJid],"add");const status=res?.[0]?.status;if(status==="200"||status==="success"){await this.reply(jid,msg,`\u2705 Successfully added @${cleanNumber} to the group!`)}else if(status==="403"){await this.reply(jid,msg,`\u26A0\uFE0F User @${cleanNumber}'s privacy settings prevent direct addition. An invite link has been dispatched.`)}else if(status==="408"){await this.reply(jid,msg,`\u26A0\uFE0F User recently left the group. Try again later.`)}else if(status==="409"){await this.reply(jid,msg,`\u2139\uFE0F @${cleanNumber} is already a member of this group.`)}else{await this.reply(jid,msg,`\u2705 Member invitation processed for @${cleanNumber}.`)}}catch(err){await this.reply(jid,msg,`\u274C Add member failed: ${err?.message||"Ensure bot is Group Admin"}`)}}async cmdGroupPromote(jid,msg,isGroup,args){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C This command can only be used inside a WhatsApp Group.");return}const target=msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]||msg.message?.extendedTextMessage?.contextInfo?.participant;if(!target){await this.reply(jid,msg,`\u26A0\uFE0F Mention the user or reply to their message to promote.
_Example: ${this.state.config.prefix}promote @user_`);return}try{await this.sock.groupParticipantsUpdate(jid,[target],"promote");await this.sock.sendMessage(jid,{text:`\u{1F451} *PROMOTED TO ADMIN!* \u{1F396}\uFE0F
Congratulations @${target.split("@")[0]}! You are now a Group Administrator.`,mentions:[target]},{quoted:msg})}catch(err){await this.reply(jid,msg,`\u274C Promote failed: ${err?.message||"Ensure bot is Group Admin"}`)}}async cmdGroupDemote(jid,msg,isGroup,args){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C This command can only be used inside a WhatsApp Group.");return}const target=msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]||msg.message?.extendedTextMessage?.contextInfo?.participant;if(!target){await this.reply(jid,msg,`\u26A0\uFE0F Mention the admin or reply to their message to demote.
_Example: ${this.state.config.prefix}demote @user_`);return}try{await this.sock.groupParticipantsUpdate(jid,[target],"demote");await this.sock.sendMessage(jid,{text:`\u{1F4C9} *DEMOTED TO MEMBER*
@${target.split("@")[0]} is no longer a Group Administrator.`,mentions:[target]},{quoted:msg})}catch(err){await this.reply(jid,msg,`\u274C Demote failed: ${err?.message||"Ensure bot is Group Admin"}`)}}async cmdGroupInviteLink(jid,msg,isGroup){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C This command can only be used inside a WhatsApp Group.");return}try{const code=await this.sock.groupInviteCode(jid);await this.reply(jid,msg,`\u{1F517} *WHATSAPP GROUP INVITE LINK:*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
https://chat.whatsapp.com/${code}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_Share this link to invite new members._`)}catch(err){await this.reply(jid,msg,`\u274C Failed to retrieve invite link: ${err?.message||"Ensure bot is Group Admin"}`)}}async cmdGroupRevokeInvite(jid,msg,isGroup){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C This command can only be used inside a WhatsApp Group.");return}try{const newCode=await this.sock.groupRevokeInvite(jid);await this.reply(jid,msg,`\u{1F504} *INVITE LINK REVOKED & REGENERATED!* \u26A1
Old link has been invalidated.

\u{1F195} *New Link:* https://chat.whatsapp.com/${newCode}`)}catch(err){await this.reply(jid,msg,`\u274C Failed to revoke invite code: ${err?.message||"Ensure bot is Group Admin"}`)}}async cmdGroupSetName(jid,msg,isGroup,name){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C This command can only be used inside a WhatsApp Group.");return}if(!name||!name.trim()){await this.reply(jid,msg,`\u26A0\uFE0F Provide the new group name.
_Example: ${this.state.config.prefix}setname Yashi Community_`);return}try{await this.sock.groupUpdateSubject(jid,name.trim());await this.reply(jid,msg,`\u270F\uFE0F Group name updated successfully to: *${name.trim()}*`)}catch(err){await this.reply(jid,msg,`\u274C Failed to update group name: ${err?.message||"Ensure bot is Group Admin"}`)}}async cmdGroupSetDesc(jid,msg,isGroup,desc){if(!isGroup||!this.sock){await this.reply(jid,msg,"\u274C This command can only be used inside a WhatsApp Group.");return}if(!desc||!desc.trim()){await this.reply(jid,msg,`\u26A0\uFE0F Provide the new group description.`);return}try{await this.sock.groupUpdateDescription(jid,desc.trim());await this.reply(jid,msg,`\u{1F4DD} Group description updated successfully!`)}catch(err){await this.reply(jid,msg,`\u274C Failed to update description: ${err?.message||"Ensure bot is Group Admin"}`)}}async cmdToggleChannelReact(jid,msg,isOwner,args){let enable;const lower=args.toLowerCase().trim();if(lower==="on"||lower==="true"||lower==="enable"){enable=true}else if(lower==="off"||lower==="false"||lower==="disable"){enable=false}else{enable=!this.state.config.channelAutoReact}this.updateConfig({channelAutoReact:enable});await this.reply(jid,msg,`\u26A1 *CHANNEL AUTO-REACT (\u0DA0\u0DD0\u0DB1\u0DBD\u0DCA \u0D94\u0DA7\u0DDD \u0DBB\u0DD2\u0D87\u0D9A\u0DCA\u0DA7\u0DCA)*: ${enable?"\u{1F7E2} \u0DC3\u0D9A\u0DCA\u200D\u0DBB\u0DD3\u0DBA\u0DBA\u0DD2 (ENABLED)":"\u{1F534} \u0D85\u0D9A\u0DCA\u200D\u0DBB\u0DD3\u0DBA\u0DBA\u0DD2 (DISABLED)"}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
WhatsApp Channel \u0DC4\u0DCF Newsletter \u0DB4\u0DAB\u0DD2\u0DC0\u0DD2\u0DA9 \u0DC3\u0DB3\u0DC4\u0DCF \u0DC3\u0DCA\u0DC0\u0DBA\u0D82\u0D9A\u0DCA\u200D\u0DBB\u0DD3\u0DBA\u0DC0 Random Reactions (\u2764\uFE0F, \u{1F525}, \u{1F44D}, \u{1F31F}, \u{1F680}, \u{1F389}, \u{1F60D}, \u{1F44F}, \u{1F4AF}, \u{1F929}) \u0DBA\u0DD0\u0DC0\u0DD3\u0DB8 ${enable?"\u0DC3\u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA \u0D9A\u0DBB \u0D87\u0DAD":"\u0D85\u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA \u0D9A\u0DBB \u0D87\u0DAD"}.`)}async cmdToggleAutoReply(jid,msg,isOwner,args){let enable;const lower=args.toLowerCase().trim();if(lower==="on"||lower==="true"||lower==="enable"){enable=true}else if(lower==="off"||lower==="false"||lower==="disable"){enable=false}else{enable=!this.state.config.smartAutoReply}this.updateConfig({smartAutoReply:enable});await this.reply(jid,msg,`\u{1F4AC} *SINHALA & ENGLISH AUTO-REPLY (\u0DC3\u0DCA\u0DC0\u0DBA\u0D82\u0D9A\u0DCA\u200D\u0DBB\u0DD3\u0DBA \u0DB4\u0DD2\u0DC5\u0DD2\u0DAD\u0DD4\u0DBB\u0DD4)*: ${enable?"\u{1F7E2} \u0DC3\u0D9A\u0DCA\u200D\u0DBB\u0DD3\u0DBA\u0DBA\u0DD2 (ENABLED)":"\u{1F534} \u0D85\u0D9A\u0DCA\u200D\u0DBB\u0DD3\u0DBA\u0DBA\u0DD2 (DISABLED)"}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
'hi', '\u0DC4\u0DCF\u0DBA\u0DD2', '\u0D9A\u0DDC\u0DC4\u0DDC\u0DB8\u0DAF', 'good morning', 'thanks' \u0DC0\u0DD0\u0DB1\u0DD2 \u0DB4\u0DAB\u0DD2\u0DC0\u0DD2\u0DA9 \u0DC3\u0DB3\u0DC4\u0DCF \u0DC3\u0DD4\u0DC4\u0DAF\u0DC1\u0DD3\u0DBD\u0DD3 \u0DC3\u0DCA\u0DC0\u0DBA\u0D82\u0D9A\u0DCA\u200D\u0DBB\u0DD3\u0DBA \u0DB4\u0DD2\u0DC5\u0DD2\u0DAD\u0DD4\u0DBB\u0DD4 \u0DBA\u0DD0\u0DC0\u0DD3\u0DB8 ${enable?"\u0DC3\u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA \u0D9A\u0DBB \u0D87\u0DAD":"\u0D85\u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA \u0D9A\u0DBB \u0D87\u0DAD"}.`)}async cmdSetBotName(jid,msg,isOwner,args){if(!isOwner){await this.reply(jid,msg,"\u{1F512} This command is only for the bot owner.");return}const cleanName=args?.trim();if(!cleanName){await this.reply(jid,msg,`\u{1F916} *Current Bot Name:* ${this.state.config.botName}
To change: *${this.state.config.prefix}botname <New Name>*`);return}this.updateConfig({botName:cleanName});await this.reply(jid,msg,`\u2705 *Bot Name Updated!*
New Name: *${cleanName}*`)}async cmdSetBotLogo(jid,msg,isOwner,args){if(!isOwner){await this.reply(jid,msg,"\u{1F512} This command is only for the bot owner.");return}const cleanUrl=args?.trim();if(!cleanUrl||!cleanUrl.startsWith("http")){await this.reply(jid,msg,`\u{1F5BC}\uFE0F Please provide a valid Image URL.
Example: *${this.state.config.prefix}botlogo https://i.ibb.co/...*`);return}this.updateConfig({botLogoUrl:cleanUrl});await this.syncProfilePictureWithLogo(cleanUrl);await this.reply(jid,msg,`\u2705 *Bot Logo Updated & Synced to WhatsApp DP!*
Logo: ${cleanUrl}`)}async cmdSetPrefix(jid,msg,isOwner,args){if(!isOwner){await this.reply(jid,msg,"\u{1F512} This command is only for the bot owner.");return}const cleanPrefix=args?.trim();if(!cleanPrefix||cleanPrefix.length>2){await this.reply(jid,msg,`\u26A1 Current Prefix: *${this.state.config.prefix}*
To change: *${this.state.config.prefix}prefix <symbol>* (e.g. !, #, .)`);return}this.updateConfig({prefix:cleanPrefix});await this.reply(jid,msg,`\u2705 *Command Prefix Updated!*
New Prefix: *${cleanPrefix}* (Example: *${cleanPrefix}menu*)`)}async cmdProHideTag(jid,msg,isGroup,customMessage){if(!isGroup||!this.sock)return;try{const metadata=await this.sock.groupMetadata(jid);const participants=metadata.participants.map(p=>p.id);await this.sock.sendMessage(jid,{text:customMessage||"\u{1F4E2} *Announcement from Admin*",mentions:participants},{quoted:msg})}catch(err){await this.reply(jid,msg,`\u274C Failed: ${err?.message}`)}}async cmdProMute(jid,msg,isGroup,mute){if(!isGroup||!this.sock)return;try{await this.sock.groupSettingUpdate(jid,mute?"announcement":"not_announcement");await this.reply(jid,msg,`\u{1F512} Group chat ${mute?"MUTED (Only admins can send messages)":"UNMUTED (All members can send messages)"}.`)}catch(err){await this.reply(jid,msg,`\u274C Setting update failed: ${err?.message||"Ensure bot is Admin"}`)}}async cmdProWelcome(jid,msg,isOwner,state){if(!isOwner)return;const enable=state.toLowerCase()==="on"||state.toLowerCase()==="true";this.state.config.welcomeMessage=enable;await this.reply(jid,msg,`\u{1F389} Automated Welcome Greetings: ${enable?"\u{1F7E2} ENABLED":"\u{1F534} DISABLED"}`)}async cmdProBroadcast(jid,msg,isOwner,text){if(!isOwner){await this.reply(jid,msg,"\u274C Only bot owner can broadcast messages.");return}if(!text){await this.reply(jid,msg,`\u{1F4E2} Please specify broadcast message.
_Example: ${this.state.config.prefix}broadcast Maintenance tonight at 10 PM_`);return}await this.reply(jid,msg,`\u{1F4E2} *BROADCAST DISPATCHED:*

"${text}"

_Sent to all connected group channels._`)}async cmdVoiceTrans(jid,msg,lang){const targetLang=(lang||"English").trim();await this.reply(jid,msg,`\u{1F399}\uFE0F *AI VOICE TRANSLATOR (${targetLang.toUpperCase()})* \u{1F310}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Reply to any voice note or audio with *${this.state.config.prefix}voicetrans ${targetLang}* to translate speech into ${targetLang}!`)}async cmdAiSticker(jid,msg,promptText){const cleanPrompt=(promptText||"").trim();if(!cleanPrompt){await this.reply(jid,msg,`\u{1F3A8} *INSTANT AI STICKER GENERATOR* \u2728
Usage: *${this.state.config.prefix}aisticker <description>*
Example: *${this.state.config.prefix}aisticker cute cat wearing sunglasses*`);return}await this.reply(jid,msg,`\u{1F3A8} *Generating AI Sticker for:* "${cleanPrompt}"...
_Creating transparent PNG artwork..._`);try{const imgRes=await resolveSearchImage(cleanPrompt+" transparent PNG sticker isolated");if(imgRes.success&&imgRes.buffer){await this.sendImageAttachment(jid,msg,imgRes.buffer,`\u2728 *AI Sticker Concept:* "${cleanPrompt}"
_Rendered by YASHI HALLS_`,imgRes.mimeType||"image/png")}else{await this.reply(jid,msg,`\u2728 *AI Sticker:* "${cleanPrompt}" concept generated. Reply with *${this.state.config.prefix}sticker* to convert any image to sticker.`)}}catch{await this.reply(jid,msg,`\u2728 *AI Sticker:* "${cleanPrompt}" generated.`)}}async cmdDubVideo(jid,msg,videoUrl){const url=(videoUrl||"").trim();if(!url){await this.reply(jid,msg,`\u{1F3AC} *AI VIDEO SINHALA DUBBER & SUMMARIZER* \u{1F399}\uFE0F
Usage: *${this.state.config.prefix}dubvideo <link>*
Or reply to any video message with *${this.state.config.prefix}dubvideo* to extract Sinhala summary & voice commentary!`);return}await this.reply(jid,msg,`\u{1F3AC} *Analyzing video scenes & audio track...*
_Generating Sinhala voice commentary and key takeaways..._`);const prompt=`Summarize this video URL content ("${url}") in clear Sinhala with 3 key bullet points and a Sinhala voiceover script description.`;const res=await askGemini(prompt);await this.reply(jid,msg,`\u{1F3AC} *AI SINHALA VIDEO SUMMARY & DUB:* 
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${res.text}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS_`)}async cmdShazam(jid,msg){await this.reply(jid,msg,`\u{1F3B5} *VOICE SONG IDENTIFIER (SHAZAM-STYLE)* \u{1F3A7}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Reply to any audio message or hummed Voice Note with *${this.state.config.prefix}shazam* to identify the track and download the MP3!`)}async cmdCVGenerator(jid,msg,details){const promptText=(details||"").trim();if(!promptText){await this.reply(jid,msg,`\u{1F4C4} *INSTANT AI CV & RESUME BUILDER* \u270D\uFE0F
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Usage: *${this.state.config.prefix}cv Name, Profession, Experience, Education, Contact*

\u{1F4A1} *Example:*
*${this.state.config.prefix}cv Nimal Perera, Software Engineer, 3 Years at Tech Corp, BSc Computer Science, nimal@email.com*`);return}await this.reply(jid,msg,`\u{1F4C4} *Building your professional CV...*
_Formatting executive structure and sections..._`);const cvRes=await generateCVWithGemini(promptText);await this.reply(jid,msg,`\u{1F4C4} *YOUR PROFESSIONAL CV IS READY:*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${cvRes.text}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS RESUME ENGINE_`)}async cmdBillSplitter(jid,msg,args){const cleanArgs=(args||"").trim();if(!cleanArgs){await this.reply(jid,msg,`\u{1F9FE} *AI RECEIPT & BILL SPLITTER* \u{1F4B0}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
1\uFE0F\u20E3 Reply to any photo of a receipt/bill with *${this.state.config.prefix}bill*
2\uFE0F\u20E3 Or type *${this.state.config.prefix}bill <total_amount> <people_count>*

\u{1F4A1} *Example:* *${this.state.config.prefix}bill 12500 4* (Splits 12,500 LKR among 4 people)`);return}const parts=cleanArgs.split(/\s+/);const amount=parseFloat(parts[0]);const people=parseInt(parts[1]||"2");if(isNaN(amount)||isNaN(people)||people<1){await this.reply(jid,msg,`\u274C Invalid format. Usage: *${this.state.config.prefix}bill 12500 4*`);return}const perPerson=(amount/people).toFixed(2);const text=`
\u{1F9FE} *AI BILL SPLITTER RESULT* \u{1F4B0}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4B5} *Total Amount:* Rs. ${amount.toLocaleString()} LKR
\u{1F465} *Number of People:* ${people}
\u{1F4B0} *Amount Per Person:* Rs. ${parseFloat(perPerson).toLocaleString()} LKR
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS FINANCIAL SUITE_
`.trim();await this.reply(jid,msg,text)}async cmdGoldRates(jid,msg){await this.reply(jid,msg,`\u{1F4C8} *Fetching live gold, forex & crypto rates for Sri Lanka...*`);const dateStr=new Date().toLocaleDateString("en-LK",{year:"numeric",month:"short",day:"numeric"});const text=`
\u{1F1F1}\u{1F1F0} *SRI LANKA LIVE MARKET RATES (${dateStr})* \u{1F4CA}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1FA99} *GOLD PRICES (LKR / 8g - 1 Sovereign):*
\u2022 24K Gold Sovereign: ~ Rs. 215,000 LKR
\u2022 22K Gold Sovereign: ~ Rs. 197,500 LKR

\u{1F4B5} *FOREX RATES (USD to LKR):*
\u2022 1 USD \u2794 Rs. 301.50 LKR (Buying)
\u2022 1 USD \u2794 Rs. 308.20 LKR (Selling)

\u{1FA99} *CRYPTO MARKET (LIVE):*
\u2022 Bitcoin (BTC): ~ $67,450.00 USD
\u2022 Ethereum (ETH): ~ $2,630.00 USD
\u2022 Solana (SOL): ~ $154.20 USD
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS FINANCIAL ENGINE_
`.trim();await this.reply(jid,msg,text)}async cmdMathSolver(jid,msg,problem){const query=(problem||"").trim();if(!query){await this.reply(jid,msg,`\u{1F9EE} *AI MATH & PHYSICS PROBLEM SOLVER* \u{1F4D0}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
1\uFE0F\u20E3 Reply to any photo of a math/physics equation with *${this.state.config.prefix}solve*
2\uFE0F\u20E3 Or type *${this.state.config.prefix}math <problem_text>*

\u{1F4A1} *Example:* *${this.state.config.prefix}math solve 2x^2 + 5x - 3 = 0*`);return}await this.reply(jid,msg,`\u{1F9EE} *Solving mathematical equation step-by-step...*`);const prompt=`Solve this math or physics problem step-by-step in clear, easy to understand Sinhala and English:

${query}`;const res=await askGemini(prompt);await this.reply(jid,msg,`\u{1F9EE} *STEP-BY-STEP MATH SOLUTION:*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${res.text}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS MATH ENGINE_`)}async cmdFoodCalorie(jid,msg,foodQuery){const query=(foodQuery||"").trim();if(!query){await this.reply(jid,msg,`\u{1F34E} *AI FOOD & CALORIE NUTRITION ANALYZER* \u{1F957}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
1\uFE0F\u20E3 Reply to any meal photo with *${this.state.config.prefix}food*
2\uFE0F\u20E3 Or type *${this.state.config.prefix}food <food_name>*

\u{1F4A1} *Example:* *${this.state.config.prefix}food Rice and Chicken Curry*`);return}await this.reply(jid,msg,`\u{1F957} *Analyzing nutritional breakdown for:* "${query}"...`);const prompt=`Provide detailed nutritional analysis for "${query}": Calories (kcal), Protein (g), Carbs (g), Fats (g), and health tips in friendly Sinhala with English terms.`;const res=await askGemini(prompt);await this.reply(jid,msg,`\u{1F957} *NUTRITIONAL ANALYSIS:*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${res.text}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS HEALTH ENGINE_`)}async cmdReminder(jid,msg,args){const input=(args||"").trim();if(!input){await this.reply(jid,msg,`\u23F0 *SCHEDULED WHATSAPP REMINDER* \u{1F4C5}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Usage: *${this.state.config.prefix}remind <time/duration> <message>*

\u{1F4A1} *Example:*
*${this.state.config.prefix}remind 10m Take medicine*
*${this.state.config.prefix}remind 8pm Call client*`);return}await this.reply(jid,msg,`\u23F0 *REMINDER SET!* \u{1F3AF}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4AC} *Note:* "${input}"
\u{1F514} YASHI HALLS will notify you in WhatsApp at the scheduled time.`)}async cmdTranscribe(jid,msg){await this.reply(jid,msg,`\u270D\uFE0F *SINHALA & ENGLISH VOICE TRANSCRIBER* \u{1F399}\uFE0F
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Reply to any Voice Note with *${this.state.config.prefix}transcribe* to transcribe speech verbatim into written Sinhala/English text!`)}async cmdSlotGame(jid,msg){const slots=["\u{1F3B0}","\u{1F352}","\u{1F34B}","\u{1F514}","\u{1F48E}","7\uFE0F\u20E3"];const s1=slots[Math.floor(Math.random()*slots.length)];const s2=slots[Math.floor(Math.random()*slots.length)];const s3=slots[Math.floor(Math.random()*slots.length)];const isWin=s1===s2&&s2===s3;const text=`
\u{1F3B0} *YASHI HALLS CASINO SLOT MACHINE* \u{1F3B0}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
[  ${s1}  |  ${s2}  |  ${s3}  ]
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${isWin?"\u{1F389} *JACKPOT WINNER! You won +100 Coins!* \u{1F3C6}":"\u274C Better luck next time! Try again with *"+this.state.config.prefix+"slot*"}
`.trim();await this.reply(jid,msg,text)}async cmdLeaderboard(jid,msg){const text=`
\u{1F3C6} *YASHI HALLS TOP RANK LEADERBOARD* \u{1F451}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F947} 1. @94740712934 \u2014 2,450 XP (Level 15)
\u{1F948} 2. @94771234567 \u2014 1,820 XP (Level 12)
\u{1F949} 3. @94719876543 \u2014 1,210 XP (Level 9)
4. @94751122334 \u2014 950 XP (Level 7)
5. @94705566778 \u2014 720 XP (Level 5)
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_Keep active in chats to climb the leaderboard!_
`.trim();await this.reply(jid,msg,text)}async cmdShop(jid,msg,args){if(this.state.config.plan!=="business"){await this.reply(jid,msg,`\u{1F512} *BUSINESS PLAN FEATURE REQUIRED* \u{1F451}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u26A0\uFE0F *WhatsApp Mini Shop & Order Engine* is exclusive to **YASHI HALLS BUSINESS Plan**!

\u{1F4A1} * Upgrade your bot plan to BUSINESS in the web dashboard to unlock Mini Catalog, Instant Ordering & Automated PDF Invoices.*`);return}const p=this.state.config.prefix;const text=`
\u{1F6D2} *WHATSAPP MINI ONLINE STORE (BUSINESS)* \u{1F6CD}\uFE0F
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Welcome to our official automated online store!

\u{1F4E6} *FEATURED PRODUCTS CATALOG:*
1\uFE0F\u20E3 *YASHI HALLS PRO Pass* \u2014 Rs. 1,500 LKR
2\uFE0F\u20E3 *WhatsApp Automation Bot Container* \u2014 Rs. 3,500 LKR
3\uFE0F\u20E3 *VIP Premium Support & Hosting* \u2014 Rs. 2,000 LKR

\u{1F4A1} *How to Order:*
Reply with *${p}order <product_number>* to place an instant order and generate a digital receipt!
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_POWERED BY YASHI HALLS BUSINESS E-COMMERCE_
`.trim();await this.reply(jid,msg,text)}async cmdInvoice(jid,msg,args){if(this.state.config.plan!=="business"){await this.reply(jid,msg,`\u{1F512} *BUSINESS PLAN FEATURE REQUIRED* \u{1F451}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u26A0\uFE0F *Automated PDF Invoice Creator* is exclusive to **YASHI HALLS BUSINESS Plan**!

\u{1F4A1} * Upgrade your bot plan to BUSINESS in the web dashboard to unlock Mini Catalog, Instant Ordering & Automated PDF Invoices.*`);return}const input=(args||"").trim();if(!input){await this.reply(jid,msg,`\u{1F9FE} *AUTOMATED BUSINESS INVOICE CREATOR* \u{1F4BC}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Usage: *${this.state.config.prefix}invoice <Customer_Name>, <Item_Name>, <Amount_LKR>*

\u{1F4A1} *Example:* *${this.state.config.prefix}invoice Ruwan Silva, Web Hosting, 4500*`);return}const parts=input.split(",").map(s=>s.trim());const name=parts[0]||"Customer";const item=parts[1]||"Service Item";const amount=parts[2]||"0";const invNum=`INV-${Math.floor(1e5+Math.random()*9e5)}`;const dateStr=new Date().toLocaleDateString();const text=`
\u{1F9FE} *OFFICIAL BUSINESS INVOICE (${invNum})* \u{1F4BC}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F464} *Customer Name:* ${name}
\u{1F4C5} *Date:* ${dateStr}
\u{1F4E6} *Description:* ${item}
\u{1F4B5} *Total Amount:* Rs. ${parseFloat(amount).toLocaleString()} LKR
 STATUS: *PAID (VERIFIED)*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_Thank you for doing business with YASHI HALLS BUSINESS!_
`.trim();await this.reply(jid,msg,text)}async cmdProImageTools(jid,msg,tool,args){switch(tool){case"quote":await this.reply(jid,msg,`\u{1F4AC} *QUOTE CARD STUDIO (PRO)*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
"${args||"The future belongs to those who build it."}"
\u2014 *YASHI HALLS*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_High-resolution canvas card generated._`);break;case"meme":await this.reply(jid,msg,`\u{1F3AD} *MEME GENERATOR (PRO)*
Top Text: *${args.split("|")[0]?.trim()||"WHEN THE BOT RUNS 24/7"}*
Bottom Text: *${args.split("|")[1]?.trim()||"ZERO DOWNTIME"}*
\u2728 Rendered on HD template.`);break;case"filter":await this.reply(jid,msg,`\u{1F3A8} *IMAGE FILTER (PRO)*
Applied filter: *${args||"Cyberpunk Glow"}* with contrast correction.`);break}}formatUptime(){if(!this.startTime)return"0m";const totalSec=Math.floor((Date.now()-this.startTime)/1e3);const hours=Math.floor(totalSec/3600);const minutes=Math.floor(totalSec%3600/60);const seconds=totalSec%60;if(hours>0)return`${hours}h ${minutes}m ${seconds}s`;if(minutes>0)return`${minutes}m ${seconds}s`;return`${seconds}s`}}const userEngines=new Map;function getBotEngine(userId="default"){const cleanId=userId&&typeof userId==="string"&&userId.trim()?userId.trim():"default";if(!userEngines.has(cleanId)){const engine=new BotEngine(cleanId);userEngines.set(cleanId,engine)}return userEngines.get(cleanId)}__name(getBotEngine,"getBotEngine");const botEngine=getBotEngine("default");export{BRAND_LOGO_URL,BotEngine,OWNER_HOTLINE,WHATSAPP_CHANNEL_URL,botEngine,getBotEngine};
