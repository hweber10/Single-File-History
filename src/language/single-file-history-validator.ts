import type { ValidationAcceptor, ValidationChecks } from 'langium';
import { SingleFileHistoryAstType, History, Project, Model } from './generated/ast.js';
import type { SingleFileHistoryServices } from './single-file-history-module.js';
/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SingleFileHistoryServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SingleFileHistoryValidator;
    const checks: ValidationChecks<SingleFileHistoryAstType> = {
        History: validator.checkForCorrectHistoryDefinition,
        Project: validator.checkForCorrectProjectDefinition,
        Model: validator.checkForCorrectModelDefinition
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SingleFileHistoryValidator {

    checkForCorrectModelDefinition(model: Model, accept: ValidationAcceptor): void {
        if(model.version && !this.correctVersion(model.version)){
            accept('warning', 'please write the Version in the following format: x.y or x.y.z', { node: model, property: 'version'});
        }
        this.checkForUniqueIDs(model, accept);
    }

    checkForCorrectHistoryDefinition(history: History, accept: ValidationAcceptor): void {
        if(history.date && !this.correctDate(history.date)){
            accept('warning', 'please write your Date in the following format: YYYY-MM-DD', { node: history, property: 'date'});
        }
        if(history.duedate && !this.correctDate(history.duedate)){
            accept('warning', 'please write your DueDate in the following format: YYYY-MM-DD', { node: history, property: 'duedate'});
        }
        if(history.id && !this.correctID(history.id)){
            accept('warning', "The ID must start with `H` followed by a number.", { node: history, property: 'id'});
        }
        if(history.del && !this.correctDel(history.del)){
            accept('warning', "The DEL must start with one or more uppercase letters followed by a number.", { node: history, property: 'del'});
        }
    }

    checkForUniqueIDs(model: Model, accept: ValidationAcceptor): void {
        // create a set of visited functions
        // and report an error when we see one we've already seen
        const reported = new Set();
        model.history.forEach(d => {
            if (reported.has(d.id)) {
                accept('error',  `The ID '${d.id}' is not unique.`,  {node: d, property: 'id'});
            }
            reported.add(d.id);
        });
    }

    checkForCorrectProjectDefinition(project: Project, accept: ValidationAcceptor): void {
        if(project.cbdnumber && !this.correctCBD(project.cbdnumber)){
            accept('warning', 'The CBD must start with `CBD` followed by a number.', { node: project, property: 'cbdnumber'});
        }
        if(project.prjnumber && !this.correctPRJ(project.prjnumber)){
            accept('warning', 'The CBD must start with `PRJ` followed by a number.', { node: project, property: 'prjnumber'});
        }
        if(project.sdpversion && !this.correctVersion(project.sdpversion)){
            accept('warning', 'please write the Version in the following format: x.y or x.y.z', { node: project, property: 'sdpversion'});
        }
    }

    correctID(id: string): boolean{
        let regex = new RegExp("^H\\d+$");
        return regex.test(id);
    }

    correctDel(del: string): boolean{
        let regex = new RegExp("^[A-Z]+\\d+");
        return regex.test(del);
    }

    correctDate(date: string): boolean {
        let regex = new RegExp("^\\d{4}\\-\\d{2}\\-\\d{2}$");
        return regex.test(date);
    }

    correctCBD(cbd: string): boolean {
        let regex = new RegExp("^CBD\\d+$");
        return regex.test(cbd);
    }

    correctPRJ(cbd: string): boolean {
        let regex = new RegExp("^PRJ\\d+$");
        return regex.test(cbd);
    }

    correctVersion(version: string): boolean {
        let regex = new RegExp("^\\d+(\\.\\d+){1,2}$"); //des hier noch fertig schreiben..
        return regex.test(version);
    }

}
