export default class User {
    profile = null;
    token = null;
    loggedIn = false;
    getCurrentBranchId = () => 0;
    redirect = () => { };
    currentBranchId = null;

    constructor(account, funcGetCurrentBranchId, funcRedirect) {
        //this.profile = account.user;

        for (let key in account.user) {
            this[key] = account.user[key];
        }

        this.token = account.token;
        this.loggedIn = account.loggedIn;
        this.getCurrentBranchId = funcGetCurrentBranchId;
        this.redirect = funcRedirect;
        this.currentBranchId = this.getCurrentBranchId();
    }

    isUser = id => {
        return this.id == id;
    }

    isInRole = role => {
        if (this.roles) {
            return this.roles.find(r => r.name == role && r.status == 1) != null;
        }
        return false;
    }

    hasCap = (caps, branchId) => {
        if (this.isInRole("Administrators")) return true;

        if (!caps || !this.caps) return false;

        branchId = branchId === undefined ? this.getCurrentBranchId() : (branchId || 0);

        caps = caps.split(/\||,|;/);

        for (let cap of caps) {
            let cap1 = "Branch" + branchId + "." + cap;
            let cap2 = "Branch0." + cap;

            if (this.caps.indexOf(cap1) > -1 || this.caps.indexOf(cap2) > -1) return true;
        }
        return false;
    }

    can = (action, entry) => {
        entry = entry || {};

        if (this.isInRole("Administrators")) return true;

        let ok = this.hasCap(action);

        switch (action) {
            case "SomeAction1":
                //check it
                ok = true;
                break;
            case "SomeAction2":
                //check it
                ok = false;
                break;
        }

        return ok;
    }
}