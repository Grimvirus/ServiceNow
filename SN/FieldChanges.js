try {
		var gru = GlideScriptRecordUtil.get(current);
		var fields = gru.getChangedFieldNames();
		
		//Convert to JavaScript Arrays
		gs.include('j2js');
		fields = j2js(fields);
		
		var changedFields = [];
		for (var i=0; i < fields.length; i++) {
			if (fields[i] != "u_update_by_child" && fields[i] != "u_update_by_external" && fields[i] != "u_update_by_parent" && fields[i] != "u_update_direct") {
				changedFields.push(fields[i]);
			}
		}
		gs.log("Changed Fields: " + changedFields + " | " + changedFields.length);
		if (changedFields.length == 0) {
			current.setAbortAction(true);
		}
	} catch(e) {}
	
	
