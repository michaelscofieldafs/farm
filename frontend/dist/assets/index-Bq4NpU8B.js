import{cD as C,cE as T,cF as P,cG as h,cH as b,cI as O,cJ as g,ds as S,dt as R,cN as x,cO as L,cP as _,du as f,cU as k,d7 as I,cQ as p,d1 as A,cV as E,dn as v}from"./index-CcpU8MoF.js";const D=C`
  :host {
    position: relative;
    display: inline-block;
  }

  input {
    width: 48px;
    height: 48px;
    background: ${({tokens:i})=>i.theme.foregroundPrimary};
    border-radius: ${({borderRadius:i})=>i[4]};
    border: 1px solid ${({tokens:i})=>i.theme.borderPrimary};
    font-family: ${({fontFamily:i})=>i.regular};
    font-size: ${({textSize:i})=>i.large};
    line-height: 18px;
    letter-spacing: -0.16px;
    text-align: center;
    color: ${({tokens:i})=>i.theme.textPrimary};
    caret-color: ${({tokens:i})=>i.core.textAccentPrimary};
    transition:
      background-color ${({durations:i})=>i.lg}
        ${({easings:i})=>i["ease-out-power-2"]},
      border-color ${({durations:i})=>i.lg}
        ${({easings:i})=>i["ease-out-power-2"]},
      box-shadow ${({durations:i})=>i.lg}
        ${({easings:i})=>i["ease-out-power-2"]};
    will-change: background-color, border-color, box-shadow;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: ${({spacing:i})=>i[4]};
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  input:focus-visible:enabled {
    background-color: transparent;
    border: 1px solid ${({tokens:i})=>i.theme.borderSecondary};
    box-shadow: 0px 0px 0px 4px ${({tokens:i})=>i.core.foregroundAccent040};
  }
`;var y=function(i,t,e,n){var o=arguments.length,s=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,e):n,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(i,t,e,n);else for(var a=i.length-1;a>=0;a--)(r=i[a])&&(s=(o<3?r(s):o>3?r(t,e,s):r(t,e))||s);return o>3&&s&&Object.defineProperty(t,e,s),s};let c=class extends O{constructor(){super(...arguments),this.disabled=!1,this.value=""}render(){return g`<input
      type="number"
      maxlength="1"
      inputmode="numeric"
      autofocus
      ?disabled=${this.disabled}
      value=${this.value}
    /> `}};c.styles=[T,P,D];y([h({type:Boolean})],c.prototype,"disabled",void 0);y([h({type:String})],c.prototype,"value",void 0);c=y([b("wui-input-numeric")],c);const F=S`
  :host {
    position: relative;
    display: block;
  }
`;var d=function(i,t,e,n){var o=arguments.length,s=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,e):n,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(i,t,e,n);else for(var a=i.length-1;a>=0;a--)(r=i[a])&&(s=(o<3?r(s):o>3?r(t,e,s):r(t,e))||s);return o>3&&s&&Object.defineProperty(t,e,s),s};let u=class extends O{constructor(){super(...arguments),this.length=6,this.otp="",this.values=Array.from({length:this.length}).map(()=>""),this.numerics=[],this.shouldInputBeEnabled=t=>this.values.slice(0,t).every(n=>n!==""),this.handleKeyDown=(t,e)=>{const n=t.target,o=this.getInputElement(n),s=["ArrowLeft","ArrowRight","Shift","Delete"];if(!o)return;s.includes(t.key)&&t.preventDefault();const r=o.selectionStart;switch(t.key){case"ArrowLeft":r&&o.setSelectionRange(r+1,r+1),this.focusInputField("prev",e);break;case"ArrowRight":this.focusInputField("next",e);break;case"Shift":this.focusInputField("next",e);break;case"Delete":o.value===""?this.focusInputField("prev",e):this.updateInput(o,e,"");break;case"Backspace":o.value===""?this.focusInputField("prev",e):this.updateInput(o,e,"");break}},this.focusInputField=(t,e)=>{if(t==="next"){const n=e+1;if(!this.shouldInputBeEnabled(n))return;const o=this.numerics[n<this.length?n:e],s=o?this.getInputElement(o):void 0;s&&(s.disabled=!1,s.focus())}if(t==="prev"){const n=e-1,o=this.numerics[n>-1?n:e],s=o?this.getInputElement(o):void 0;s&&s.focus()}}}firstUpdated(){this.otp&&(this.values=this.otp.split(""));const t=this.shadowRoot?.querySelectorAll("wui-input-numeric");t&&(this.numerics=Array.from(t)),this.numerics[0]?.focus()}render(){return g`
      <wui-flex gap="1" data-testid="wui-otp-input">
        ${Array.from({length:this.length}).map((t,e)=>g`
            <wui-input-numeric
              @input=${n=>this.handleInput(n,e)}
              @click=${n=>this.selectInput(n)}
              @keydown=${n=>this.handleKeyDown(n,e)}
              .disabled=${!this.shouldInputBeEnabled(e)}
              .value=${this.values[e]||""}
            >
            </wui-input-numeric>
          `)}
      </wui-flex>
    `}updateInput(t,e,n){const o=this.numerics[e],s=t||(o?this.getInputElement(o):void 0);s&&(s.value=n,this.values=this.values.map((r,a)=>a===e?n:r))}selectInput(t){const e=t.target;e&&this.getInputElement(e)?.select()}handleInput(t,e){const n=t.target,o=this.getInputElement(n);if(o){const s=o.value;t.inputType==="insertFromPaste"?this.handlePaste(o,s,e):x.isNumber(s)&&t.data?(this.updateInput(o,e,t.data),this.focusInputField("next",e)):this.updateInput(o,e,"")}this.dispatchInputChangeEvent()}handlePaste(t,e,n){const o=e[0];if(o&&x.isNumber(o)){this.updateInput(t,n,o);const r=e.substring(1);if(n+1<this.length&&r.length){const a=this.numerics[n+1],$=a?this.getInputElement(a):void 0;$&&this.handlePaste($,r,n+1)}else this.focusInputField("next",n)}else this.updateInput(t,n,"")}getInputElement(t){return t.shadowRoot?.querySelector("input")?t.shadowRoot.querySelector("input"):null}dispatchInputChangeEvent(){const t=this.values.join("");this.dispatchEvent(new CustomEvent("inputChange",{detail:t,bubbles:!0,composed:!0}))}};u.styles=[T,F];d([h({type:Number})],u.prototype,"length",void 0);d([h({type:String})],u.prototype,"otp",void 0);d([R()],u.prototype,"values",void 0);u=d([b("wui-otp")],u);const N=L`
  wui-loading-spinner {
    margin: 9px auto;
  }

  .email-display,
  .email-display wui-text {
    max-width: 100%;
  }
`;var m=function(i,t,e,n){var o=arguments.length,s=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,e):n,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(i,t,e,n);else for(var a=i.length-1;a>=0;a--)(r=i[a])&&(s=(o<3?r(s):o>3?r(t,e,s):r(t,e))||s);return o>3&&s&&Object.defineProperty(t,e,s),s},w;let l=w=class extends _{firstUpdated(){this.startOTPTimeout()}disconnectedCallback(){clearTimeout(this.OTPTimeout)}constructor(){super(),this.loading=!1,this.timeoutTimeLeft=f.getTimeToNextEmailLogin(),this.error="",this.otp="",this.email=k.state.data?.email,this.authConnector=I.getAuthConnector()}render(){if(!this.email)throw new Error("w3m-email-otp-widget: No email provided");const t=!!this.timeoutTimeLeft,e=this.getFooterLabels(t);return p`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["4","0","4","0"]}
        gap="4"
      >
        <wui-flex
          class="email-display"
          flexDirection="column"
          alignItems="center"
          .padding=${["0","5","0","5"]}
        >
          <wui-text variant="md-regular" color="primary" align="center">
            Enter the code we sent to
          </wui-text>
          <wui-text variant="md-medium" color="primary" lineClamp="1" align="center">
            ${this.email}
          </wui-text>
        </wui-flex>

        <wui-text variant="sm-regular" color="secondary">The code expires in 20 minutes</wui-text>

        ${this.loading?p`<wui-loading-spinner size="xl" color="accent-primary"></wui-loading-spinner>`:p` <wui-flex flexDirection="column" alignItems="center" gap="2">
              <wui-otp
                dissabled
                length="6"
                @inputChange=${this.onOtpInputChange.bind(this)}
                .otp=${this.otp}
              ></wui-otp>
              ${this.error?p`
                    <wui-text variant="sm-regular" align="center" color="error">
                      ${this.error}. Try Again
                    </wui-text>
                  `:null}
            </wui-flex>`}

        <wui-flex alignItems="center" gap="2">
          <wui-text variant="sm-regular" color="secondary">${e.title}</wui-text>
          <wui-link @click=${this.onResendCode.bind(this)} .disabled=${t}>
            ${e.action}
          </wui-link>
        </wui-flex>
      </wui-flex>
    `}startOTPTimeout(){this.timeoutTimeLeft=f.getTimeToNextEmailLogin(),this.OTPTimeout=setInterval(()=>{this.timeoutTimeLeft>0?this.timeoutTimeLeft=f.getTimeToNextEmailLogin():clearInterval(this.OTPTimeout)},1e3)}async onOtpInputChange(t){try{this.loading||(this.otp=t.detail,this.shouldSubmitOnOtpChange()&&(this.loading=!0,await this.onOtpSubmit?.(this.otp)))}catch(e){this.error=A.parseError(e),this.loading=!1}}async onResendCode(){try{if(this.onOtpResend){if(!this.loading&&!this.timeoutTimeLeft){if(this.error="",this.otp="",!I.getAuthConnector()||!this.email)throw new Error("w3m-email-otp-widget: Unable to resend email");this.loading=!0,await this.onOtpResend(this.email),this.startOTPTimeout(),E.showSuccess("Code email resent")}}else this.onStartOver&&this.onStartOver()}catch(t){E.showError(t)}finally{this.loading=!1}}getFooterLabels(t){return this.onStartOver?{title:"Something wrong?",action:`Try again ${t?`in ${this.timeoutTimeLeft}s`:""}`}:{title:"Didn't receive it?",action:`Resend ${t?`in ${this.timeoutTimeLeft}s`:"Code"}`}}shouldSubmitOnOtpChange(){return this.authConnector&&this.otp.length===w.OTP_LENGTH}};l.OTP_LENGTH=6;l.styles=N;m([v()],l.prototype,"loading",void 0);m([v()],l.prototype,"timeoutTimeLeft",void 0);m([v()],l.prototype,"error",void 0);l=w=m([b("w3m-email-otp-widget")],l);export{l as W};
