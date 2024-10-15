import { RoutingService } from "../../services/RoutingService.js";

const pageNames = Object.freeze({
    Templates: "books-generator-templates-page",
    Books: "books-generator-page",
})
export class BooksGeneratorSidebar {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.invalidate();
    }

    async beforeRender() {

    }

    async afterRender() {

    }
    async changePage(_target, selectedPageName) {
        RoutingService.navigateInternal(pageNames[selectedPageName], {});
    }
}
