package com.erp.app.domain.custom;

import com.erp.app.domain.Status;
import com.erp.app.domain.util.CascadeSave;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Entity
// @Document(collection = "Status")
public class StatusCustom extends Status implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    public StatusCustom() {
        super();
    }

}
