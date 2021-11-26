
import * as signalR from '@microsoft/signalr';
import { AsyncStorage } from 'react-native';

let hostStore = "https://fbchat2.ecrm.vn";
let tokenStore = null;
AsyncStorage.getItem('access_token').then(token => {
    // // console.log(token, "------------token")
    tokenStore = token;
    AsyncStorage.getItem('host').then(host => {
        // // console.log(host, "------------1")
        hostStore = host;
    })
})
const messagehub = new signalR.HubConnectionBuilder()
    .withUrl(hostStore + "/messagehub", {
        accessTokenFactory: () => {
            return tokenStore;
        },
    })
    .withAutomaticReconnect([0, 100, 200, 500, 800, 1000, 2000, 3000, null])
    .configureLogging(signalR.LogLevel.Information)
    .build();

export function connect() {
    if (tokenStore) {

        messagehub.start()
            .then((d) => {
                messagehub.invoke("Join", hostStore);
            })
            .catch(e => {
                // console.log(e, 'connect error, reconnecting..')
                setTimeout(connect, 3000);
            })
    }
    else {
        setTimeout(connect, 10000);
    }
}

messagehub.onclose(() => {
    // console.log('message hub closed, reconnecting...')
    connect();
})

export function disconnect() {
    messagehub.stop();
}

class SyncEvent {
    constructor(type) {
        this.type = type;
        this.funcs = [];
    }

    handleMessage = data => {
        // // console.log(data)
        if (data.type == this.type) {
            // console.log(this.funcs)
            if (!data.host || data.host == hostStore.replace(/^(https?|ftp):\/\//, "")) {
                this.funcs.forEach(f => f(data.data));
            }
        }

    }

    addEventListener = func => {
        if (func) {
            if (this.funcs.length == 0) {
                // console.log("addEventListener message")
                messagehub.on('message', this.handleMessage);
            }
            this.funcs = [...this.funcs, func];
        }
    }

    removeEventListener = func => {
        if (func) {
            this.funcs = this.funcs.filter(f => f != func);
            if (this.funcs.length == 0) {
                messagehub.off('message', this.handleMessage);
            }
        }
    }
}

messagehub.on('connected', data => {
    window.signalRConnectionId = data.connectionId;
    // console.log('singleR: connected', data)
})

messagehub.on('pong', data => {
    // console.log('singleR: pong', data)
})

messagehub.onreconnected(data => {
    messagehub.invoke("Join", hostStore);
})

window.ping = (message) => {
    messagehub.invoke("Ping", message, hostStore)
}

connect();

export default messagehub;

export const customerImportEvent = new SyncEvent('CUSTOMER_IMPORT');
export const leadImportEvent = new SyncEvent('LEAD_IMPORT');
export const productImportEvent = new SyncEvent('PRODUCT_IMPORT');
export const invoiceImportEvent = new SyncEvent('INVOICE_IMPORT');
export const pancakeImportEvent = new SyncEvent('PANCAKE_IMPORT');
export const fbCustomerImportEvent = new SyncEvent('FB_CUSTOMER_IMPORT');
export const ladipageEvent = new SyncEvent('REGISTER_LADIPAGE');
export const updateLeadsEvent = new SyncEvent('UPDATE_LEADS');
export const updateLeadLogEvent = new SyncEvent('UPDATE_LEAD_LOG');
export const googleUpdateTokenEvent = new SyncEvent('GOOGLE_UPDATE_TOKEN');

export const posSyncEvent = new SyncEvent('POS_SYNC_MESSAGE');
export const transporterSyncEvent = new SyncEvent('TRANSPORTER_SYNC');
export const orderRefreshEvent = new SyncEvent('REFRESH_ORDER');
export const invoiceCommentUpdateEvent = new SyncEvent('INVOICE_COMMENT');
export const setTagOrderEvent = new SyncEvent('UPDATE_ORDER_TAG');
export const setTagCustomerEvent = new SyncEvent('UPDATE_CUSTOMER_TAG');

export const updateFieldEvent = new SyncEvent('UPDATE_FIELD');

export const fbMessageEvent = new SyncEvent('FB_MESSAGE');
export const fbMessageToPageEvent = new SyncEvent('FB_MESSAGE_TO_PAGE');
export const tagPancakeImport = new SyncEvent('TAGPANCAKE_IMPORT');
export const moveConversationEvent = new SyncEvent('MOVE_CONVERSATION');
export const updateConversationEvent = new SyncEvent('UPDATE_CONVERSATION');
export const takeConversationEvent = new SyncEvent('UPDATE_CONVERSATION_SELF');
export const updateConversationTagEvent = new SyncEvent('UPDATE_CONVERSATIONS_TAG');
export const updateConversationNewEvent = new SyncEvent('UPDATE_CONVERSATION_NOW');
export const updateConversationAssignEvent = new SyncEvent('UPDATE_CONVERSATION_ASSIGN_NOW');
export const assignConversationEvent = new SyncEvent('UPDATE_CONVERSATION_ASSIGN');
export const statusConversationEvent = new SyncEvent('UPDATE_CONVERSATION_STATUS');
export const templateMessageImportEvent = new SyncEvent('TEMPLATE_MESSAGE_IMPORT');
export const autoTemplateMessageImportEvent = new SyncEvent('AUTO_TEMPLATE_MESSAGE_IMPORT');

