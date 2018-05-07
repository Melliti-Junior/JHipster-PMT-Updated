package com.erp.app.domain.custom;

import com.erp.app.domain.Resolution;
import com.erp.app.domain.util.CascadeSave;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Entity
// @Document(collection = "resolution")
public class ResolutionCustom extends Resolution implements Serializable {

	/**
	 *
	 */
	private static final long serialResolutionUID = 1L;

	public ResolutionCustom() {
		super();
	}

}
