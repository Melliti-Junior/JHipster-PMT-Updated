package com.erp.app.domain.custom;

import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import com.erp.app.domain.Epic;
import com.erp.app.domain.Issue;
import com.erp.app.domain.IssuePriority;
import com.erp.app.domain.IssueType;

public class IssueCustom extends Issue {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@DBRef
	@Field("type")
    private IssueType type;

	@DBRef
	@Field("priority")
    private IssuePriority priority;

	@DBRef
	@Field("epic")
    private Epic epic;

	public IssueCustom(IssueType type, IssuePriority priority, Epic epic) {
		super();
		this.type = type;
		this.priority = priority;
		this.epic = epic;
	}


	public IssueCustom() {
		super();
	}

	public IssueType getType() {
		return type;
	}

	public void setType(IssueType type) {
		this.type = type;
	}

	public IssuePriority getPriority() {
		return priority;
	}

	public void setPriority(IssuePriority priority) {
		this.priority = priority;
	}

	public Epic getEpic() {
		return epic;
	}

	public void setEpic(Epic epic) {
		this.epic = epic;
	}

}
