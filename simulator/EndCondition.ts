﻿import { IEndCondition } from "./interface/IEndCondition";
import { IState } from "./interface/IState";
import { IWarrior } from "./interface/IWarrior";
import * as _ from "underscore";

export class EndCondition implements IEndCondition {

    private pubSubProvider: any;

    public setMessageProvider(provider: any) {
        this.pubSubProvider = provider;
    }

    public check(state: IState): boolean {

        if (state.cycle === state.options.cyclesBeforeTie) {
            if(this.pubSubProvider) {
                this.pubSubProvider.publishSync('RUN_PROGRESS', {
                    runProgress: 100
                });
            }
            return true;
        }

        if((state.cycle % (state.options.cyclesBeforeTie / 100)) === 0) {
            if(this.pubSubProvider) {
                this.pubSubProvider.publishSync('RUN_PROGRESS', {
                    runProgress: state.cycle / (state.options.cyclesBeforeTie / 100)
                });
            }
        }

        var liveWarriors = _(state.warriors).filter((warrior: IWarrior) => warrior.tasks.length > 0);

        if (state.warriors.length > 1) {
            return liveWarriors.length === 1;
        } else {
            return liveWarriors.length === 0;
        }
    }
}