var dialogClass = window.GlideModal ? GlideModal : GlideDialogWindow;
dlg = new dialogClass('delete_confirm_form');
dlg.setTitle(new GwtMessage().getMessage('Confirmation'));
dlg.setWidth(450);
dlg.setPreference('sysparm_obj_id', objSysId);
dlg.setPreference('sysparm_table_name', tblName);
dlg.setPreference('sysparm_delobj_list', objList);  
dlg.setPreference('sysparm_parent_form', this);
dlg.render();
