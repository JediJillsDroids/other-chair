import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/+esm";
import { config } from "./config.js";

const STORE={chairs:"otherchair.baseline.chairs",requests:"otherchair.baseline.requests",device:"otherchair.device.id"};
const load=k=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch{return[]}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function deviceId(){let id=localStorage.getItem(STORE.device);if(!id){id=crypto.randomUUID();localStorage.setItem(STORE.device,id)}return id}

class OtherChairBackend{
  constructor(){this.mode="local";this.client=null;this.session=null;this.initError=null}
  get statusLabel(){if(this.mode==="supabase")return"Shared backend live";if(this.initError)return"Offline/local fallback";return"Local test mode"}
  async init(){
    if(config.backendMode!=="supabase"||!config.supabase?.projectUrl||!config.supabase?.publishableKey)return this;
    try{
      this.client=createClient(config.supabase.projectUrl,config.supabase.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
      const current=await this.client.auth.getSession();if(current.error)throw current.error;this.session=current.data.session;
      if(!this.session){const signIn=await this.client.auth.signInAnonymously();if(signIn.error)throw signIn.error;this.session=signIn.data.session}
      if(!this.session?.user?.id)throw new Error("Supabase did not return an anonymous user session.");
      this.mode="supabase";this.initError=null;
    }catch(error){console.warn("Supabase initialization failed; using local fallback.",error);this.mode="local";this.initError=error}
    return this;
  }
  async offerChair(input){
    if(this.mode==="supabase"){
      const row={title:input.title,activity:input.activity,place:input.place,starts_at:input.starts_at,seats:input.seats,description:input.description,host_name:input.host_name,owner_device:deviceId(),owner_user_id:this.session.user.id,status:"open",opener_attending:true,city:input.city||null,area:input.area||null,country_code:"KR"};
      const {data,error}=await this.client.from("chairs").insert(row).select("id").single();if(error)throw error;return{id:data.id,shared:true};
    }
    const chairs=load(STORE.chairs);const row={id:crypto.randomUUID(),...input,seats_open:input.seats,status:"open",created_at:new Date().toISOString(),is_mine:true};chairs.push(row);save(STORE.chairs,chairs);return{id:row.id,shared:false};
  }
  async findChairs(term=""){
    if(this.mode==="supabase"){const {data,error}=await this.client.rpc("find_chairs_v2",{p_query:String(term||"")});if(error)throw error;return data||[]}
    const q=String(term||"").trim().toLowerCase();return load(STORE.chairs).filter(c=>c.status==="open").filter(c=>!q||[c.title,c.activity,c.place,c.city,c.area].some(v=>String(v||"").toLowerCase().includes(q))).map(c=>({...c,seats_open:c.seats_open??c.seats,is_mine:Boolean(c.is_mine)})).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
  }
  async takeChair(chairId){
    if(this.mode==="supabase"){const {data,error}=await this.client.rpc("take_chair",{p_chair_id:chairId});if(error)throw error;return{request:data,shared:true}}
    const requests=load(STORE.requests);const request={id:crypto.randomUUID(),chair_id:chairId,status:"requested",created_at:new Date().toISOString()};requests.push(request);save(STORE.requests,requests);return{request,shared:false};
  }
}
export const backend=new OtherChairBackend();
