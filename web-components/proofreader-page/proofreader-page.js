export class ProofReaderPage {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.invalidate();
        this.text = "";
    }

    beforeRender() {

    }

    afterRender(){

    }

    async executeProofRead(formElement) {
        const formData= await assistOS.UI.extractFormInformation(formElement);
        if(formData.isValid){
            this.text = formData.data.text;
            this.personality = assistOS.space.getPersonality(formData.data.personality);
            this.details = formData.data.details;
            let result = await assistOS.callFlow("Proofread", {
                text: this.text,
                prompt: formData.data.prompt
            }, formData.data.personality);
            this.observations = result.observations;
            this.generatedText = result.improvedText;
            this.invalidate();
        }
    }

    async regenerate(_target){
        if(this.text!==undefined){
            await this.executeProofRead(this.element.querySelector("form"));
        }
    }
    async copyText(_target){
        let text=await assistOS.UI.reverseQuerySelector(_target,".improved-text-container");
        if(text){
            await navigator.clipboard.writeText(text.innerText);
            text.insertAdjacentHTML("afterend", `<confirmation-popup data-presenter="confirmation-popup" 
                    data-message="Copied!" data-left="${text.offsetWidth+150}"></confirmation-popup>`);
        }
    }
}
