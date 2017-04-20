UI MACRO:

<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">
   <j:set var="jvar_n" value="show_n2k_${ref}"/>
	
   <g2:evaluate var="jvar_show_n2k_display" jelly="true">
      var id = __ref__.getSysIdValue();
      if (id == null)
         "none";
      else {
         var ga = new GlideRecord('core_company');
         ga.addQuery('sys_id', id);
   		 ga.setLimit(1);
         ga.query();
         if (ga.next()) {
			if (ga.notes || ga.u_parent_company.notes) {
            "";
		    } else {
		      "none";
	        }
         } else {
            "none";
	     }
      }
   </g2:evaluate>

	<a id="${jvar_n}"
	 class="reference_decoration btn btn-default icon-lightbulb"
     onclick="showN2KDialog('${ref}')"
     name="${jvar_n}" 
     style="display:$[jvar_show_n2k_display]"
     title="${gs.getMessage('Show nice to know information')}">
   
   </a>
   
   <script>
      needsRefresh = false;
      function onChange_company_show_n2k(element, original, changed, loading) {
         if (needsRefresh == false) {
            needsRefresh = true;
            return;
         }
         if (changed.length == 0) {
            $('${jvar_n}').hide();
            return;
         }
         var ga = new GlideAjax('ShowN2KAjax');
         ga.addParam('sysparm_name', 'hasN2K');
         ga.addParam('sysparm_company', g_form.getValue('${ref}'));
         ga.getXML(relatedN2KReturn);
      }
      
      function relatedN2KReturn(response) {
         var answer = String(response.responseXML.documentElement.getAttribute("answer")) == "true";
         var e = $('${jvar_n}');
         if (answer)
            e.show();
         else
            e.hide();
      }
      
      var h = new GlideEventHandler('onChange_incident_company_show_n2k', onChange_company_show_n2k, '${ref}');
      g_event_handlers.push(h);
      
      function showN2KDialog(reference){
         var v = g_form.getValue(reference);
         var w = new GlideDialogWindow('show_n2k');
	     w.setSize(600,100);
         w.setTitle(getMessage('Nice to know'));
         w.setPreference('sysparm_company', v);
         w.render();
      }
   </script>
</j:jelly>


UI PAGE:
<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">
	<g:evaluate>
		var comp = RP.getWindowProperties().get('sysparm_company');
		var htmlArr = [];
		
		var gr = new GlideRecord("core_company");
		if (gr.get(comp)) {
			if (gr.u_parent_company.notes) {
				htmlArr.push("<strong>"+gr.u_parent_company.name+":</strong><br/>"+gr.u_parent_company.notes);
			}

			if (gr.notes) {
		htmlArr.push("<strong>"+gr.name+":</strong><br/>"+gr.notes);
			}
		}
		
		var html = htmlArr.join("<br/>");
	</g:evaluate>

	<script>
		var refs = document.getElementById("popup_close_image");
		refs.remove();
	</script>

	<table width="100%">
		<tr id="description_row" valign="top">
			<td width="5%" rowspan="99"><img src="blub.png" width="64" style="margin:15px"/></td>
			<td width="95%">
				<g:no_escape>${html}</g:no_escape>
			</td>
		</tr>
	</table>

	<table width="100%">
		<tr id="dialog_buttons">
			<td style="text-align:right">
				<g:dialog_button_ok ok="return setOK()" ok_type="submit" />
			</td>
		</tr>
	</table>
</j:jelly>

---------------

function setOK() {
	GlideDialogWindow.get().destroy();
}





