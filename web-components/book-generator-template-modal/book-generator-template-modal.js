const applicationModule = require('assistos').loadModule('application', {});
const personalityModule = require('assistos').loadModule('personality', {});
const utilModule = require('assistos').loadModule('util', {});

export class BooksGeneratorTemplateModal {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.invalidate();
    }

    async beforeRender() {
        const personalities = await personalityModule.getPersonalitiesMetadata(assistOS.space.id);
        this.personalityOptions = personalities.map(personality => {
            return `<option value="${personality.id}">${personality.name}</option>`;
        })

        /* TODO mechanism to download multiple prompts at the same time without knowing the name of the files from an application folder
           Why would an application need an endpoint to access its own files rather than solving the require issue and let the application
           handle its dependencies internally?
         */

        this.bookSchema = JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/bookSchema.json")));
        this.bookSchemSinica = JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/promptGenereareBookSinica.json")));

        this.templateData = JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "data/templateData.json")));

        this.genres = this.templateData.genres.map(genre => {
            return `<option value="${genre}">${genre}</option>`;
        });
        this.tones = this.templateData.tones.map(tone => {
            return `<option value="${tone}">${tone}</option>`;
        })
        this.subjects = this.templateData.subjects.map(subject => {
            return `<option value="${subject}">${subject}</option>`;
        })
        this.writingStyles = this.templateData.writingStyles.map(writingStyle => {
            return `<option value="${writingStyle}">${writingStyle}</option>`;
        });
        this.languages = this.templateData.languages.map(language => {
            return `<option value="${language}">${language}</option>`;
        });
        this.targetAudiences = this.templateData.targetAudiences.map(targetAudience => {
            return `<option value="${targetAudience}">${targetAudience}</option>`;
        });
        this.timePeriods = this.templateData.timePeriods.map(timePeriod => {
            return `<option value="${timePeriod}">${timePeriod}</option>`;
        });
        this.environments = this.templateData.environments.map(environmentType => {
            return `<option value="${environmentType}">${environmentType}</option>`;
        });
        this.themes = this.templateData.themes.map(theme => {
            return `<option value="${theme}">${theme}</option>`;
        });
        this.prompts =
            `<option value="bookSchema">Book Schema</option>` +
            `<option value="promptGenerareBookSinica">Prompt Generare Book Sinica</option>`;
    }

    async afterRender() {
        await this.updateReviewPrompt()
        this.addEventListeners();
    }

    addEventListeners() {
        const inputs = this.element.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.updateReviewPrompt());
        });
    }

    async updateReviewPrompt() {
        const formElement = this.element.querySelector("form");
        const formData = await assistOS.UI.extractFormInformation(formElement);
        // get Personality text, in loc de formDAta.data.personality
        const bookData = {
            title: formData.data.title || '',
            personality: formData.data.personality || '',
            subject: formData.data.subject || '',
            genre: formData.data.genre || '',
            tone: formData.data.tone || '',
            chapters: formData.data.chapters || 0,
            ideasPerChapter: formData.data.nr_ideea || 0,
            style: formData.data.style || '',
            language: formData.data.language || '',
            targetAudience: formData.data.targetAudience || '',
            environments: formData.data.environments || '',
            bannedKeywords: formData.data.bannedKeywords || '',
            bannedConcepts: formData.data.bannedConcepts || '',
        };
        const bookGenerationInfo = formData.data.otherOption || ''

        const updatedTemplateData = {
            bookGenerationInfo,
            bookData
        };

        const filledJSONTemplate = utilModule.fillTemplate(this.bookSchema, updatedTemplateData);
        this.renderPrompt(filledJSONTemplate);
        this.element.querySelector("#review-prompt").value = this.reviewPrompt;
    }

    renderPrompt(schemaData) {
        this.reviewPrompt = Object.keys(schemaData)
            .map(key => {
                if (!isNaN(parseInt(key))) {
                    return schemaData[key]
                }
            })
            .join("\n");
    }

    async closeModal(_target) {
        await assistOS.UI.closeModal(_target);
    }

    async generateBookTemplate(_target) {
        await assistOS.loadifyFunction(async () => {
                const formElement = this.element.querySelector("form");
                const formData = await assistOS.UI.extractFormInformation(formElement);
                if (!formData.isValid) {
                    return assistOS.UI.showApplicationError("Invalid form data", "Please fill all the required fields", "error");
                }
                const documentData = formData.data;
                const documentId = (await applicationModule.runApplicationFlow(assistOS.space.id, "BooksGenerator", "GenerateTemplate", documentData)).data;
                assistOS.UI.closeModal(_target);
                await assistOS.UI.changeToDynamicPage(`space-application-page`, `${assistOS.space.id}/Space/document-view-page/${documentId}`);
            }
        )
    }

    async PreviewBookTemplateModal(_target) {
        await assistOS.UI.showModal("book-generator-template-preview", {
            "presenter": "book-generator-template-preview",
        });
    }
}
