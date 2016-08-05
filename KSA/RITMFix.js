var current = new GlideRecord("sc_req_item");
current.get("9b6205054fc5aa009afadf601310c760");

var workflow = new Workflow().getRunningFlows(current);
while(workflow.next()) {     

// DD.MM.YYYY - Author - Comments
// 05.11.2014 - OD - Initial Version

try {
	(function(){
		var sd = "";
		var d = "";
		var ag = "";
		var parser = new JSONParser();
		var parsed = parser.parse(new KSA_IDM_Functions().string2UTF8(workflow.scratchpad.full_data));
		var acc_tasks = [];
		
		var fid = workflow.scratchpad.function_guid;
		var funcID = 0;
		for (var iID = 0; iID < parsed.Funktionen.length; iID++) {
			if (parsed.Funktionen[iID].Key == fid) {
				funcID = iID;
			}
		}
		
		var orgName = new KSA_IDM_Functions().getIDMValue("u_ksa_organisation", "sys_id="+current.variables.reference_Organisation, "u_name");
		
		// Get Mitarbeiter Eintritt
		var grSC = new GlideRecord("sc_task");
		grSC.addQuery("request_item", current.sys_id);
		grSC.addQuery("u_task_type", "mitarbeiter_eintritt_select");
		grSC.query();
		grSC.next();
		
		var hint_tasks = 0;
		var account_ids = workflow.scratchpad.account_ids.split(",");
		for (var i=0; i< account_ids.length; i++) {
			if (account_ids[i].split("#")[1] != "") {
				sd = getIDMAccountLabel(account_ids[i].split("#")[0])+": Neues Login für Benutzer "+account_ids[i].split("#")[1];
				d = "Für den folgenden Benutzer muss ein Applikationslogin eingerichtet werden:";
				d = d + "<br/>Benutzername: " + account_ids[i].split("#")[1];
				d = d + "<br/>Hinweis: Ist die Appl. ID schon vergeben, bitte mit dem Identity Management vom ServiceDesk Kontakt aufnehmen.<br/>";
				d = d + "<br/>Anzeigename: " + current.variables.text_Vorname +" "+ current.variables.text_Nachname;
				var title = "";
				var email = "";
				var standort = "";
				var tel = "";
				var pernum = "";
				
				// IDM Skip, first function is not always the correct function, so rather use the infos from the User record
				if (grSC.u_idm_action == "skip_idm") {
					if (grSC.u_idm_person.u_contract_start != "") {
						d = d + "<br/>Vertragsstart: " + grSC.u_idm_person.u_contract_start.getDisplayValue();
					}
					d = d + "<br/>Eintrittsdatum: " + current.variables.date_Eintrittsdatum.getDisplayValue();
					d = d + "<br/>Abteilung: " + grSC.u_idm_person.u_organisational_unit.getDisplayValue();
					if (parsed.Personnalnummer != null) {
						d = d + "<br/>Personalnummer: " + parsed.Personnalnummer;
						pernum = parsed.Personnalnummer;
					}
					d = d + "<br/>Kostenstelle: " + grSC.u_idm_person.cost_center.getDisplayValue() + " / " + grSC.u_idm_person.cost_center.name;
					d = d + "<br/>Titel: " + grSC.u_idm_person.title;
					d = d + "<br/>Stellenbezeichnung: " + grSC.u_idm_person.u_job_description;
					d = d + "<br/>eMail: " + workflow.scratchpad.login_mail;
					d = d + "<br/>Vorgesetzter: " + grSC.u_idm_person.manager.name + " ("+grSC.u_idm_person.manager.phone+")";
					
					title = grSC.u_idm_person.title;
					email = workflow.scratchpad.login_mail;
					tel = grSC.u_idm_person.phone;
					standort = grSC.u_idm_person.location.getDisplayValue();
				} else {
					if (current.variables.date_Vertragsstart != "") {
						d = d + "<br/>Vertragsstart: " + current.variables.date_Vertragsstart.getDisplayValue();
					}
					
					d = d + "<br/>Eintrittsdatum: " + current.variables.date_Eintrittsdatum.getDisplayValue();
					d = d + "<br/>Abteilung: " + new KSA_IDM_Functions().getIDMDisplayValue("cmn_department", "id="+parsed.Funktionen[funcID].Organisationseinheit+"^id!=");
					if (parsed.Personnalnummer != null) {
						d = d + "<br/>Personalnummer: " + parsed.Personnalnummer;
						pernum = parsed.Personnalnummer;
					}
					d = d + "<br/>Kostenstelle: " + parsed.Funktionen[funcID].Kostenstelle + " / " + new KSA_IDM_Functions().getIDMValue("cmn_cost_center", "code="+parsed.Funktionen[funcID].Kostenstelle+"^code!=", "name");
					d = d + "<br/>Titel: " + current.variables.text_Titel;
					d = d + "<br/>Stellenbezeichnung: " + current.variables.text_Stellenbezeichnung;
					d = d + "<br/>eMail: " + workflow.scratchpad.login_mail;
					d = d + "<br/>Vorgesetzter: " + current.variables.reference_Vorgesetzter.name + " ("+current.variables.reference_Vorgesetzter.phone+")";
					
					title = current.variables.text_Titel;
					email = workflow.scratchpad.login_mail;
					tel = current.variables.text_Mobiltelefon;
					standort = current.variables.reference_Standort.getDisplayValue();
				}
				d = d + "<br/><br/>Angefordert von: " + current.opened_by.name;
				d = d + "<br/>Authorisiert von: " + grSC.assigned_to.name;
				d = d + "<br/><br/>Applikation: " + getIDMAccountLabel(account_ids[i].split("#")[0]);
				
				if (eval("current.variables."+account_ids[i].split("#")[0].split("checkbox").join("reference")+".name")) {
					d = d + "<br/>Rechte wie: " + eval("current.variables."+account_ids[i].split("#")[0].split("checkbox").join("reference")+".name");
				}
				
				// Spezial Fälle:
				// HOSPIS
				if (account_ids[i].split("#")[0] == "checkbox_HOSPIS_NG") {
					d = d + "<br/><br/>Privatadresse:<br/>"+current.variables.text_HOSPIS_Privatadresse.toString().split("\n").join("<br/>");
				}
				
				// eOPPS
				if (account_ids[i].split("#")[0] == "checkbox_eOPPS") {
					d = d + "<br/><br/>Typ:";
					d = d + "<br/>SPZ: " + current.variables.checkbox_eOPPS_Typ_SPZ;
					d = d + "<br/>Anästhesie: " + current.variables.checkbox_eOPPS_Typ_Anaesthesie;
					d = d + "<br/>Pflege/Chirurgie: " + current.variables.checkbox_eOPPS_Typ_Pflege_Chirurgie;
				}
				
				// WinScribe:
				if (account_ids[i].split("#")[0] == "checkbox_Winscribe") {
					d = d + "<br/><br/>Funktion: " + current.variables.mchoice_Funktion_Winscribe;
					d = d + "<br/>Typ: " + current.variables.mchoice_Typ_Winscribe.getDisplayValue();
					if (current.variables.reference_Winscribe != "") {
						d = d + "<br/>Übernahme von: " + current.variables.reference_Winscribe.name;
					}
				}
				
				// KISIM
				if (account_ids[i].split("#")[0] == "idmkisim_KISIM") {
					var kisimfkt = "";
					var kisimorg = "";
					d = d + "<br/><br/>Organisation: " + orgName;
					d = d + "<br/>KISIM-Funktionsgruppe: " + current.variables.idmkisim_funktiongruppe.getDisplayValue();
					
					if (orgName.toString().toUpperCase() == "KSA") {
						// Arzt/Ärztin
						if (current.variables.idmkisim_funktiongruppe == "kisim_fg_1") {
							d = d + "<br/>KISIM-Funktion: " + current.variables.idmkisim_funktion_arzt_ksa.getDisplayValue();
							kisimfkt = current.variables.idmkisim_funktion_arzt_ksa.getDisplayValue();
							d = d + "<br/>KISIM-Organisation: " + current.variables.idmkisim_oe_arzt_sekr_ksa.getDisplayValue();
							kisimorg = current.variables.idmkisim_oe_arzt_sekr_ksa.getDisplayValue();
						}
						
						// Pflege
						if (current.variables.idmkisim_funktiongruppe == "kisim_fg_2") {
							d = d + "<br/>KISIM-Funktion: " + current.variables.idmkisim_funktion_pflege_ksa.getDisplayValue();
							kisimfkt = current.variables.idmkisim_funktion_pflege_ksa.getDisplayValue();
							d = d + "<br/>KISIM-Pflege-Gliederung: " + current.variables.idmkisim_pfl_gliederung.getDisplayValue();
							
							// Stationär
							if (current.variables.idmkisim_pfl_gliederung == "ksa_pfl_gliederung_1") {
								d = d + "<br/>KISIM-Organisation: " + current.variables.idmkisim_oe_pfl_stat_ksa.getDisplayValue();
								kisimorg = current.variables.idmkisim_oe_pfl_stat_ksa.getDisplayValue();
							}
							// Ambulant
							if (current.variables.idmkisim_pfl_gliederung == "ksa_pfl_gliederung_2") {
								d = d + "<br/>KISIM-Organisation: " + current.variables.idmkisim_oe_pfl_ambi_ksa.getDisplayValue();
								kisimorg = current.variables.idmkisim_oe_pfl_ambi_ksa.getDisplayValue();
							}
							// Sonstige
							if (current.variables.idmkisim_pfl_gliederung == "ksa_pfl_gliederung_3") {
								d = d + "<br/>KISIM-Organisation: " + current.variables.idmkisim_oe_pfl_sonst_ksa.getDisplayValue();
								kisimorg = current.variables.idmkisim_oe_pfl_sonst_ksa.getDisplayValue();
							}
						}
						
						// Therapeutische Dienste
						if (current.variables.idmkisim_funktiongruppe == "kisim_fg_3") {
							d = d + "<br/>KISIM-Funktion: " + current.variables.idmkisim_funktion_therapDienste_ksa.getDisplayValue();
							kisimfkt = current.variables.idmkisim_funktion_therapDienste_ksa.getDisplayValue();
						}
						
						// Sekretariat
						if (current.variables.idmkisim_funktiongruppe == "kisim_fg_4") {
							d = d + "<br/>KISIM-Organisation: " + current.variables.idmkisim_oe_arzt_sekr_ksa.getDisplayValue();
							kisimorg = current.variables.idmkisim_oe_arzt_sekr_ksa.getDisplayValue();
						}
						
						// Sonstige
						if (current.variables.idmkisim_funktiongruppe == "kisim_fg_5") {
							d = d + "<br/>KISIM-Funktion: " + current.variables.idmkisim_funktion_sonstige_ksa.getDisplayValue();
							kisimfkt = current.variables.idmkisim_funktion_sonstige_ksa.getDisplayValue();
						}
					}
					
					if (orgName.toString().toUpperCase() == "SZ") {
						// Arzt/Ärztin
						if (current.variables.idmkisim_funktiongruppe == "kisim_fg_1") {
							d = d + "<br/>KISIM-Funktion: " + current.variables.idmkisim_funktion_arzt_ksa.getDisplayValue();
							kisimfkt = current.variables.idmkisim_funktion_arzt_ksa.getDisplayValue();
							d = d + "<br/>KISIM-Organisation: " + current.variables.idmkisim_oe_arzt_sekr_sz.getDisplayValue();
							kisimorg = current.variables.idmkisim_oe_arzt_sekr_sz.getDisplayValue();
						}
						
						// Pflege
						if (current.variables.idmkisim_funktiongruppe == "kisim_fg_2") {
							d = d + "<br/>KISIM-Funktion: " + current.variables.idmkisim_funktion_pflege_sz.getDisplayValue();
							kisimfkt = current.variables.idmkisim_funktion_pflege_sz.getDisplayValue();
							d = d + "<br/>KISIM-Pflege-Gliederung: " + current.variables.idmkisim_pfl_gliederung.getDisplayValue();
							
							// Stationär
							if (current.variables.idmkisim_pfl_gliederung == "ksa_pfl_gliederung_1") {
								d = d + "<br/>KISIM-Organisation: " + current.variables.idmkisim_oe_pfl_stat_sz.getDisplayValue();
								kisimorg = current.variables.idmkisim_oe_pfl_stat_sz.getDisplayValue();
							}
							// Ambulant
							if (current.variables.idmkisim_pfl_gliederung == "ksa_pfl_gliederung_2") {
								d = d + "<br/>KISIM-Organisation: " + current.variables.idmkisim_oe_pfl_ambi_sz.getDisplayValue();
								kisimorg = current.variables.idmkisim_oe_pfl_ambi_sz.getDisplayValue();
							}
							// Sonstige
							if (current.variables.idmkisim_pfl_gliederung == "ksa_pfl_gliederung_3") {
								d = d + "<br/>KISIM-Organisation: " + current.variables.idmkisim_oe_pfl_sonst_sz.getDisplayValue();
								kisimorg = current.variables.idmkisim_oe_pfl_sonst_sz.getDisplayValue();
							}
						}
						
						// Therapeutische Dienste
						if (current.variables.idmkisim_funktiongruppe == "kisim_fg_3") {
							d = d + "<br/>KISIM-Funktion: " + current.variables.idmkisim_funktion_therapDienste_ksa.getDisplayValue();
							kisimfkt = current.variables.idmkisim_funktion_therapDienste_ksa.getDisplayValue();
						}
						
						// Sekretariat
						if (current.variables.idmkisim_funktiongruppe == "kisim_fg_4") {
							d = d + "<br/>KISIM-Organisation: " + current.variables.idmkisim_oe_arzt_sekr_sz.getDisplayValue();
							kisimorg = current.variables.idmkisim_oe_arzt_sekr_sz.getDisplayValue();
						}
						
						// Sonstige
						if (current.variables.idmkisim_funktiongruppe == "kisim_fg_5") {
							d = d + "<br/>KISIM-Funktion: " + current.variables.idmkisim_funktion_sonstige_sz.getDisplayValue();
							kisimfkt = current.variables.idmkisim_funktion_sonstige_sz.getDisplayValue();
						}
					}
					
					d = d + "<br/><br/>"+account_ids[i].split("#")[1]+";"+current.variables.text_Vorname+";"+current.variables.text_Nachname+";TEST_LOGIN;"+title+";A;"+standort+";"+tel+";"+email+";"+kisimfkt+";"+pernum+";"+kisimorg+";"+account_ids[i].split("#")[1]+";N";						
				}
				
				ag = new KSA_IDM_Functions().getIDMAccountAssignmentGroup(account_ids[i].split("#")[0], workflow.scratchpad.function_org);
				
				// HINT OVERRIDE
				if (ag != "ca64afe114756100cae64d99b293b742") {
					acc_tasks.push(createIDMAccountTask(sd, d, ag).toString());
				} else {
					hint_tasks++;
				}
			}
		}
		
		// HINT OVERRIDE - Collect all "Tasks" for HINT and place into 1 big one
		// Remove this once HINT WebService is opened
		if (hint_tasks > 0 || current.variables.checkbox_Active_Directory == "true") {
			
			var org = "";
			if (grSC.u_idm_action == "skip_idm") {
				org = grSC.u_idm_person.u_organisation.u_name;
			} else {
				org = orgName // current.variables.reference_Organisation.u_name;
			}
			
			if (org) { org = org.toString().toLowerCase(); }
			if (org == "sz") { org = "spz"; }
				
			var umra_link = "";
			if (gs.getProperty("instance_name").toString().indexOf("dev") == -1 && gs.getProperty("instance_name").toString().indexOf("test") == -1) {
				umra_link = gs.getProperty(org+".umra.prod.create");
			} else {
				umra_link = gs.getProperty(org+".umra.test.create");
			}
			
			// Umra_link = PARAMETER=VALUE&
			var umra_notizen = "";
			
			sd = "Bitte in UMRA erfassen: Neue Logins für Benutzer";
			d = "Für den folgenden Benutzer muss ein Applikationslogin eingerichtet werden:";
			d = d + "<br/>Anzeigename: " + current.variables.text_Vorname +" "+ current.variables.text_Nachname;
			umra_link += "Vorname="+encodeURIComponent(current.variables.text_Vorname);
			umra_link += "&Nachname="+encodeURIComponent(current.variables.text_Nachname);
			
			// IDM Skip, first function is not always the correct function, so rather use the infos from the User record
			if (grSC.u_idm_action == "skip_idm") {
				
				if (grSC.u_idm_person.u_contract_start != "") {
					d = d + "<br/>Vertragsstart: " + grSC.u_idm_person.u_contract_start.getDisplayValue();
					umra_link += "&Eintrittsdatum="+encodeURIComponent(grSC.u_idm_person.u_contract_start.getDisplayValue());
				} else {
					umra_link += "&Eintrittsdatum="+encodeURIComponent(current.variables.date_Eintrittsdatum.getDisplayValue());
				}
				
				if (parsed.Personnalnummer != null) {
					d = d + "<br/>Personalnummer: " + parsed.Personnalnummer;
					umra_link += "&Personalnummer="+encodeURIComponent(parsed.Personnalnummer);
				}
				d = d + "<br/>Eintrittsdatum: " + current.variables.date_Eintrittsdatum.getDisplayValue();
				d = d + "<br/>Abteilung: " + grSC.u_idm_person.u_organisational_unit.getDisplayValue();
				d = d + "<br/>Kostenstelle: " + grSC.u_idm_person.cost_center.getDisplayValue() + " / " + grSC.u_idm_person.cost_center.name;
				d = d + "<br/>Titel: " + grSC.u_idm_person.title;
				d = d + "<br/>Stellenbezeichnung: " + grSC.u_idm_person.u_job_description;
				d = d + "<br/>eMail: " + workflow.scratchpad.login_mail;
				//d = d + "<br/>Intern/Extern: " + grSC.u_idm_person.u_preis_ebene.getDisplayValue();
				d = d + "<br/>Vorgesetzter: " + grSC.u_idm_person.manager.name + " ("+grSC.u_idm_person.manager.phone+")";
				
				umra_link += "&Kostenstelle="+encodeURIComponent(grSC.u_idm_person.cost_center.code);
				umra_link += "&Titel="+encodeURIComponent(grSC.u_idm_person.title);
				umra_link += "&Abteilung="+encodeURIComponent(grSC.u_idm_person.u_organisational_unit.getDisplayValue());
				umra_link += "&FunktionText="+encodeURIComponent(grSC.u_idm_person.u_job_description).toString().split("//").join("%2f");
				umra_link += "&Anrede="+encodeURIComponent(grSC.u_idm_person.u_salutation);
				umra_link += "&Anstellung="+encodeURIComponent(grSC.u_idm_person.u_personal_group.u_umra);
				
			} else {
				if (current.variables.date_Vertragsstart != "") {
					d = d + "<br/>Vertragsstart: " + current.variables.date_Vertragsstart.getDisplayValue();
					umra_link += "&Eintrittsdatum="+encodeURIComponent(current.variables.date_Vertragsstart.getDisplayValue());
				} else {
					umra_link += "&Eintrittsdatum="+encodeURIComponent(current.variables.date_Eintrittsdatum.getDisplayValue());
				}
				
				if (parsed.Personnalnummer != null) {
					d = d + "<br/>Personalnummer: " + parsed.Personnalnummer;
					umra_link += "&Personalnummer="+encodeURIComponent(parsed.Personalnummer);
				}
				d = d + "<br/>Kostenstelle: " + parsed.Funktionen[funcID].Kostenstelle + " / " + new KSA_IDM_Functions().getIDMValue("cmn_cost_center", "code="+parsed.Funktionen[funcID].Kostenstelle+"^code!=", "name");
				d = d + "<br/>Titel: " + current.variables.text_Titel;
				d = d + "<br/>Stellenbezeichnung: " + current.variables.text_Stellenbezeichnung;
				d = d + "<br/>eMail: " + workflow.scratchpad.login_mail;
				//d = d + "<br/>Intern/Extern: " + current.variables.mchoice_InternExtern;
				d = d + "<br/>Vorgesetzter: " + current.variables.reference_Vorgesetzter.name + " ("+current.variables.reference_Vorgesetzter.phone+")";
				d = d + "<br/>Eintrittsdatum: " + current.variables.date_Eintrittsdatum.getDisplayValue();
				d = d + "<br/>Abteilung: " + new KSA_IDM_Functions().getIDMDisplayValue("cmn_department", "id="+parsed.Funktionen[funcID].Organisationseinheit+"^id!=");
				
				umra_link += "&Abteilung="+encodeURIComponent(new KSA_IDM_Functions().getIDMDisplayValue("cmn_department", "id="+parsed.Funktionen[funcID].Organisationseinheit+"^id!="));
				umra_link += "&Kostenstelle="+encodeURIComponent(parsed.Funktionen[funcID].Kostenstelle);
				umra_link += "&Titel="+encodeURIComponent(current.variables.text_Titel);
				umra_link += "&FunktionText="+encodeURIComponent(current.variables.text_Stellenbezeichnung).toString().split("//").join("%2f");
				umra_link += "&Anrede="+encodeURIComponent(current.variables.text_Anrede);
				umra_link += "&Anstellung="+encodeURIComponent(current.variables.reference_Personengruppe.u_umra);
			}
			
			d = d + "<br/><br/>Angefordert von: " + current.opened_by.name;
			d = d + "<br/>Authorisiert von: " + grSC.assigned_to.name;
			
			umra_link += "&VAntragSteller="+encodeURIComponent(current.opened_by.first_name);
			umra_link += "&NAntragSteller="+encodeURIComponent(current.opened_by.last_name);
			umra_link += "&TelAntragSteller="+encodeURIComponent(current.opened_by.phone);
			
				
			if (current.variables.text_Bemerkung != "") {
				umra_notizen = current.variables.text_Bemerkung+"NEWLINE";
			}
			
			// AD/Exchange:
			if (current.variables.checkbox_Active_Directory == "true") {
				if (current.variables.checkbox_Exchange == "true") {
					d = d + "<br/><br/>Applikation: Active Directory + Exchange";
					d = d + "<br/>Benutzername: " + workflow.scratchpad.login_ad;
					d = d + "<br/>eMail: " + workflow.scratchpad.login_mail;
					d = d + "<br/>Hinweis: Ist die Appl. ID schon vergeben, bitte mit dem Identity Management vom ServiceDesk Kontakt aufnehmen.<br/>";
					umra_notizen += "AD Login: "+workflow.scratchpad.login_ad+"NEWLINE";
					umra_notizen += "Email: "+workflow.scratchpad.login_mail+"NEWLINE";
				} else {
					d = d + "<br/><br/>Applikation: Active Directory";
					d = d + "<br/>Benutzername: " + workflow.scratchpad.login_ad;
					d = d + "<br/>Hinweis: Ist die Appl. ID schon vergeben, bitte mit dem Identity Management vom ServiceDesk Kontakt aufnehmen.<br/>";
					umra_notizen += "AD Login: "+workflow.scratchpad.login_ad+"NEWLINE";
				}
			}
			
			var umra_laufwerk = "Kein Gruppenlaufwerk erforderlich";
			
			for (var j=0; j< account_ids.length; j++) {
				if (account_ids[j].split("#")[1] != "") {
					ag = new KSA_IDM_Functions().getIDMAccountAssignmentGroup(account_ids[j].split("#")[0], workflow.scratchpad.function_org);
					
					if (ag == "ca64afe114756100cae64d99b293b742") {
						// HINT TASK
						d = d + "<br/><br/>Applikation " + getIDMAccountLabel(account_ids[j].split("#")[0]) + ":";
						d = d + "<br/>Benutzername: " + account_ids[j].split("#")[1];
						d = d + "<br/>Hinweis: Ist die Appl. ID schon vergeben, bitte mit dem Identity Management vom ServiceDesk Kontakt aufnehmen.";
						d = d + "<br/>Rechte wie: " + eval("current.variables."+account_ids[j].split("#")[0].split("checkbox").join("reference")+".name");
						
						var umra_info = getIDMAccountUMRAInfo(account_ids[j].split("#")[0]);
						var umra_para = umra_info.toString().split("#")[0];
						var umra_val = umra_info.toString().split("#")[1];
						var umra_access = eval("current.variables."+account_ids[j].split("#")[0].split("checkbox").join("reference")+".first_name")+" "+eval("current.variables."+account_ids[j].split("#")[0].split("checkbox").join("reference")+".last_name");
						
						if (umra_para != "") {
							umra_link += "&"+umra_para+"=1";
							
							if (umra_val != "") {
								umra_link += "&"+umra_val+"="+encodeURIComponent(umra_access);
							}
							
							umra_notizen += getIDMAccountLabel(account_ids[j].split("#")[0])+" : " + account_ids[j].split("#")[1]+"NEWLINE";
						}

						// Spezial Fälle:
						// LAUFWERKE
						if (account_ids[j].split("#")[0] == "checkbox_Laufwerke") {
							umra_laufwerk = eval("current.variables."+account_ids[j].split("#")[0].split("checkbox").join("reference")+".last_name")+" "+eval("current.variables."+account_ids[j].split("#")[0].split("checkbox").join("reference")+".first_name");
							if (umra_laufwerk) {
								umra_link += "&"+umra_val+"="+encodeURIComponent(umra_laufwerk);
							}
						}
						
						// HOSPIS
						if (account_ids[j].split("#")[0] == "checkbox_HOSPIS_NG") {
							d = d + "<br/><br/>Privatadresse:<br/>"+current.variables.text_HOSPIS_Privatadresse.toString().split("\n").join("<br/>");
						}
						
						// eOPPS
						if (account_ids[j].split("#")[0] == "checkbox_eOPPS") {
							d = d + "<br/><br/>Typ:";
							d = d + "<br/>SPZ: " + current.variables.checkbox_eOPPS_Typ_SPZ;
							d = d + "<br/>Anästhesie: " + current.variables.checkbox_eOPPS_Typ_Anaesthesie;
							d = d + "<br/>Pflege/Chirurgie: " + current.variables.checkbox_eOPPS_Typ_Pflege_Chirurgie;
						}
						
						// WinScribe:
						if (account_ids[j].split("#")[0] == "checkbox_Winscribe") {
							d = d + "<br/><br/>Funktion: " + current.variables.mchoice_Funktion_Winscribe;
							d = d + "<br/>Typ: " + current.variables.mchoice_Typ_Winscribe.getDisplayValue();
							if (current.variables.reference_Winscribe != "") {
								d = d + "<br/>Übernahme von: " + current.variables.reference_Winscribe.name;
							}
						}
					}
				}
			}
			
			if (org == "ksa") {
				umra_notizen += "Login-Brief bitte per Mail an " + current.opened_by.first_name + " " + current.opened_by.last_name;	
			}
			
			umra_link += "&Notizen="+encodeURIComponent(umra_notizen);
			
			d = d + "<br/><br/><b>WICHTIG: Bitte Benutzernamen immer in Bemerkungen im UMRA Formular angeben, damit HINT diesen dann vergibt.</b>";
			
			if (org == "ksa" || org == "spz") {
				//d = "<a href='"+umra_link.split("NL").join("%0A")+"'><b>LINK zu UMRA</b></a><br/><br/>" + d;
			} else {
				umra_link = "";	
			}
			
			ag = "d33fe0f4246f2500cae61713293ecfad"; // ServiceDesk
			acc_tasks.push(createIDMAccountTask(sd, d, ag, umra_link).toString());
		}
		
		workflow.scratchpad.acc_tasks = acc_tasks.join(",");
		
	})();
} catch(err) {
	gs.log("ERROR: KSA Mitarbeiter Eintritt: Create APP Catalog Tasks (Dynamic) | " + err + " in line:" + err.lineNumber);
}
}
function createIDMAccountTask(sd, d, ag, link) {
	var gr = new GlideRecord("sc_task");
	gr.initialize();
	gr.short_description = sd;
	gr.description = d;
	gr.assignment_group = ag;
	gr.u_task_type = "mitarbeiter_eintritt_account_task";
	gr.request_item = current.sys_id;
	gr.u_url = link;
	return gr.insert();
}

function getIDMAccountLabel(var_name) {
	var gr = new GlideRecord("u_idm_accounts");
	gr.addQuery("u_variable.name", var_name);
	gr.query();
	if (gr.next()) {
		return gr.u_label;
	}
	return "";
}

function getIDMAccountUMRAInfo(var_name) {
	var gr = new GlideRecord("u_idm_accounts");
	gr.addQuery("u_variable.name", var_name);
	gr.query();
	if (gr.next()) {
		return gr.u_umra_parameter+"#"+gr.u_umra_value;
	}
	return "";
}
