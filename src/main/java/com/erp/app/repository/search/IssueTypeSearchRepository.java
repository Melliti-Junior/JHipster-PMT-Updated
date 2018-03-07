package com.erp.app.repository.search;

import com.erp.app.domain.IssueType;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the IssueType entity.
 */
public interface IssueTypeSearchRepository extends ElasticsearchRepository<IssueType, String> {
}
