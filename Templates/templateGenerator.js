
export class TemplateGenerator{
    constructor(){
        if (TemplateGenerator.instance) {
            return TemplateGenerator.instance;
        }
        TemplateGenerator.instance = this;
        return this;
    }

    async generateBookTemplate(){

    }
}
