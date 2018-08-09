package com.erp.app.domain.custom;

import com.erp.app.domain.Category;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CategoryCustom extends Category implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    public CategoryCustom() {
        super();
    }

}
