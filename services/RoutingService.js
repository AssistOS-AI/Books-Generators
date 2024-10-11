export class RoutingService {
    constructor() {}
    async navigateToLocation(locationArray = [], appName) {
        const BOOKSGENERATOR_PAGE = "books-generator-page";

       if (locationArray.length === 0 || locationArray[0] === BOOKSGENERATOR_PAGE) {
            const pageUrl = `${assistOS.space.id}/${appName}/${BOOKSGENERATOR_PAGE}`;
            await assistOS.UI.changeToDynamicPage(BOOKSGENERATOR_PAGE, pageUrl);
            return;
        }
         if(locationArray[locationArray.length-1]!== BOOKSGENERATOR_PAGE){
         console.error(`Invalid URL: URL must end with ${BOOKSGENERATOR_PAGE}`);
            return;
        }
        const webComponentName = locationArray[locationArray.length - 1];
        const pageUrl = `${assistOS.space.id}/${appName}/${locationArray.join("/")}`;
        await assistOS.UI.changeToDynamicPage(webComponentName, pageUrl);
    }
}
