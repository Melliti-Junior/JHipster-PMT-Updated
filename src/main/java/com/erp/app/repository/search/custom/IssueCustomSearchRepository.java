package com.erp.app.repository.search.custom;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.erp.app.domain.custom.CustomIssue;

/**
 * Spring Data Elasticsearch repository for the Epic entity.
 */

public interface IssueCustomSearchRepository extends  ElasticsearchRepository<CustomIssue, String> {
}
