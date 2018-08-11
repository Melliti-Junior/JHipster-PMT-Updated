package com.erp.app.repository.search.custom;

import com.erp.app.domain.custom.CustomStatus;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Epic entity.
 */

public interface StatusCustomSearchRepository extends  ElasticsearchRepository<CustomStatus, String> {
}
