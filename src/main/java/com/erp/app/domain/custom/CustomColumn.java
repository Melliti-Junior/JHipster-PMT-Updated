package com.erp.app.domain.custom;

import com.erp.app.domain.Column;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CustomColumn extends Column implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @Field("order")
    private Integer order;

    @DBRef
	@Field("board")
    private CustomBoard board;

	public CustomColumn(CustomBoard board) {
		super();
		this.board = board;
    }

    public CustomColumn(Integer order, CustomBoard board) {
        this.order = order;
        this.board = board;
    }

    public CustomColumn() {
		super();
	}

    public CustomBoard getBoard() {
        return board;
    }

    public void setBoard(CustomBoard board) {
        this.board = board;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }
}
