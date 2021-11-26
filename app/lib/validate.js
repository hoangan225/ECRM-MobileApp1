export const validateComponent = (com, inputs = []) => {
    let refs = com && com.refs ? Object.values(com.refs) : [];
    inputs = [...refs, ...inputs].filter(x => x != null);
    let ok = true;
    inputs.filter(item => typeof item.validate == 'function').forEach(item => {
        let iok = item.validate();
        ok = iok && ok;
        if (!iok) {
            // console.log(item);
        }
    });
    inputs.filter(item => item.getWrappedInstance && typeof item.getWrappedInstance().validate == 'function').forEach(item => {
        let iok = item.getWrappedInstance().validate();
        ok = iok && ok;
        if (!iok) {
            // console.log(item);
        }
    });
    return ok;
}