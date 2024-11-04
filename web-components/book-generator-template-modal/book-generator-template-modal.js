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


        /****/
        this.basicTemplate= JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/basicBookSchema.json")));
        this.characterAccentTemplate= JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/characterAccentBookSchema.json")));
        this.conflictDrivenTemplate= JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/conflictDrivenBookSchema.json")))
        this.imaginativeWorldTemplate= JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/imaginativeWorldBookSchema.json")))
        this.plotDrivenTemplate= JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/plotDrivenBookSchema.json")))
        this.relationBetweenTemplate= JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/RelationBetweenBookSchema.json")))
        this.transformativeJourneyTemplate= JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/transformativeJourneyBookSchema.json")))

        /***/




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
            this.prompts =
                `<option value="bookSchema">Book Schema</option>` +
                `<option value="basicTemplate">Basic Template</option>` +
                `<option value="characterAccentTemplate">Character Accent Template</option>` +
                `<option value="conflictDrivenTemplate">Conflict Driven Template</option>` +
                `<option value="imaginativeWorldTemplate">Imaginative World Template</option>` +
                `<option value="plotDrivenTemplate">Plot Driven Template</option>` +
                `<option value="relationBetweenTemplate">Relation Between Template</option>` +
                `<option value="transformativeJourneyTemplate">Transformative Journey Template</option>`;

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
        /*****************/
        const promptSelector = this.element.querySelector("#prompt");
        if (promptSelector) {
            promptSelector.addEventListener('change', () => this.updateReviewPrompt());
        }
        /****************/
    }


    async updateReviewPrompt() {
        const formElement = this.element.querySelector("form");
        const formData = await assistOS.UI.extractFormInformation(formElement);

        // get Personality text, in loc de formDAta.data.personality

        const personality=await personalityModule.getPersonality(assistOS.space.id,formData.data.personality)
        const bookData = {
            title: formData.data.title || '',
            personality: personality.name|| '',
            personality_description: personality.description|| '',
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

        /******************/
        const title = formData.data.title || '';
        const personalityName = personality.name || '';
        const personalityDescription = personality.description || '';
        const subject = formData.data.subject || '';
        const genre = formData.data.genre || '';
        const tone = formData.data.tone || '';
        const chapters = formData.data.chapters || 0;
        const ideasPerChapter = formData.data.nr_ideea || 0;
        const style = formData.data.style || '';
        const language = formData.data.language || '';
        const targetAudience = formData.data.targetAudience || '';
        const environments = formData.data.environments || '';
        const bannedKeywords = formData.data.bannedKeywords || '';
        const bannedConcepts = formData.data.bannedConcepts || '';
       /******/






        const bookGenerationInfo = formData.data.otherOption || ''

        const updatedTemplateData = {
            bookGenerationInfo,
            bookData,
            title,
            personalityName,
            personalityDescription,
            subject,
            genre,
            tone,
            chapters,
            ideasPerChapter,
            style,
            language,
            targetAudience,
            environments,
            bannedKeywords,
            bannedConcepts
        };

        /***********/
        const selectedPrompt = this.element.querySelector("#prompt").value;
        let filledJSONTemplate;
        if (selectedPrompt === "bookSchema") {
            filledJSONTemplate = utilModule.fillTemplate(this.bookSchema, updatedTemplateData);
        } else if (selectedPrompt === "basicTemplate") {
            filledJSONTemplate = utilModule.fillTemplate(this.basicTemplate, updatedTemplateData);
        } else if (selectedPrompt === "characterAccentTemplate") {
            filledJSONTemplate = utilModule.fillTemplate(this.characterAccentTemplate, updatedTemplateData);
        } else if (selectedPrompt === "conflictDrivenTemplate") {
            filledJSONTemplate = utilModule.fillTemplate(this.conflictDrivenTemplate, updatedTemplateData);
        } else if (selectedPrompt === "imaginativeWorldTemplate") {
            filledJSONTemplate = utilModule.fillTemplate(this.imaginativeWorldTemplate, updatedTemplateData);
        } else if (selectedPrompt === "plotDrivenTemplate") {
            filledJSONTemplate = utilModule.fillTemplate(this.plotDrivenTemplate, updatedTemplateData);
        } else if (selectedPrompt === "relationBetweenTemplate") {
            filledJSONTemplate = utilModule.fillTemplate(this.relationBetweenTemplate, updatedTemplateData);
        } else if (selectedPrompt === "transformativeJourneyTemplate") {
            filledJSONTemplate = utilModule.fillTemplate(this.transformativeJourneyTemplate, updatedTemplateData);
        }
        /*********/

        const reviewPrompt = this.renderPrompt(filledJSONTemplate);

        this.element.querySelector("#review-prompt").value = reviewPrompt;

    }

    /*renderPrompt(schemaData) {
        this.reviewPrompt = Object.keys(schemaData)
            .map(key => {
                if (!isNaN(parseInt(key))) {
                    return schemaData[key]
                }
            })
            .join("\n");
    }*/
    renderPrompt(schemaData) {
        return Object.keys(schemaData)
            .map(key => {
                if (!isNaN(parseInt(key))) {
                    return schemaData[key];
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
